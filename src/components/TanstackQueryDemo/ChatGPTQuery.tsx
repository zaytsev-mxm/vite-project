import React from 'react';
import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
  type DefaultError,
  type UndefinedInitialDataOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { createHttpClient } from './createHttpClient.ts';
// Reusable, type-safe CRUD layer for /users and /todos using TanStack Query v5
// - Generic fetch client with robust error handling and abort support
// - Query Key factory to avoid key collisions
// - CRUD Resource factory that returns typed hooks: useList, useById, useCreate, useUpdate, useDelete
// - Sensible defaults (caching, retries) + optimistic updates with rollback
// - Narrowed types for create/update where appropriate

// -----------------------------
// Domain types (from your API)
// -----------------------------
export type User = {
  id: string;
  name: string;
  email?: string;
  age?: number;
};

export type ToDo = {
  id: string;
  title: string;
  description?: string;
  status?: 'backlog' | 'open' | 'inprogress' | 'done';
};

// Create/Update payload helpers (exclude immutable id on create, partial on patch)
type CreatePayload<T extends { id: string }> = Omit<T, 'id'>;
type UpdatePayload<T extends { id: string }> = Partial<Omit<T, 'id'>>;

// -----------------------------
// Minimal, resilient HTTP client
// -----------------------------
export type HttpClientOptions = {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
};

export class HttpError extends Error {
  status: number;
  url: string;
  body: unknown;
  constructor(message: string, status: number, url: string, body: unknown) {
    super(message);
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

// -------------------------------------
// Query Keys (stable, collision-proof)
// -------------------------------------
const createKeys = (entity: string) => {
  const base = [entity] as const;
  return {
    all: base,
    lists: [...base, 'list'] as const,
    list: (params?: unknown) => [...base, 'list', params ?? {}] as const,
    details: [...base, 'detail'] as const,
    detail: (id: string | number) => [...base, 'detail', id] as const,
  };
};

// -------------------------------------
// CRUD Resource Factory
// -------------------------------------
// @ts-expect-error - read the next-line ESLint mute
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type CrudFactoryOptions<T extends { id: string }> = {
  entity: string; // e.g. 'users'
  path: `/${string}`; // e.g. '/users'
  client: ReturnType<typeof createHttpClient>;
  staleTimeMs?: number;
  gcTimeMs?: number;
};

// eslint-disable-next-line react-refresh/only-export-components
export const createCrudResource = <T extends { id: string }>({
  entity,
  path,
  client,
  staleTimeMs = 30_000,
  gcTimeMs = 5 * 60_000,
}: CrudFactoryOptions<T>) => {
  const keys = createKeys(entity);

  // Queries
  const useList = <TData = T[],>(
    options?: Omit<
      UndefinedInitialDataOptions<
        T[],
        DefaultError,
        TData,
        ReturnType<typeof keys.list>
      >,
      'queryKey' | 'queryFn'
    >,
  ): UseQueryResult<TData, DefaultError> => {
    return useQuery({
      queryKey: keys.list(),
      queryFn: () => client.get<T[]>(path),
      staleTime: staleTimeMs,
      gcTime: gcTimeMs,
      placeholderData: keepPreviousData,
      ...options,
    });
  };

  const useById = <TData = T,>(
    id: T['id'] | undefined,
    options?: Omit<
      UndefinedInitialDataOptions<
        T,
        DefaultError,
        TData,
        ReturnType<typeof keys.detail>
      >,
      'queryKey' | 'queryFn' | 'enabled'
    >,
  ): UseQueryResult<TData, DefaultError> => {
    return useQuery({
      queryKey: keys.detail(id as string),
      queryFn: () => client.get<T>(`${path}/${id}`),
      enabled: Boolean(id),
      staleTime: staleTimeMs,
      gcTime: gcTimeMs,
      ...options,
    });
  };

  // Mutations with optimistic updates
  const useCreate = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (payload: CreatePayload<T>) =>
        client.post<CreatePayload<T>, T>(path, payload),
      onMutate: async (newItem) => {
        await qc.cancelQueries({ queryKey: keys.lists });
        const prev = qc.getQueryData<T[]>(keys.list());
        const optimistic: T = {
          ...(newItem as any), // eslint-disable-line @typescript-eslint/no-explicit-any
          id: `optimistic-${crypto.randomUUID()}`,
        };
        if (prev) qc.setQueryData<T[]>(keys.list(), [optimistic, ...prev]);
        return { prev };
      },
      onError: (_err, _newItem, ctx) => {
        if (ctx?.prev) qc.setQueryData(keys.list(), ctx.prev);
      },
      onSuccess: (created) => {
        // Replace optimistic entry if present
        qc.setQueryData<T[]>(keys.list(), (curr) =>
          curr
            ? [
                created,
                ...curr.filter(
                  (i) => i.id !== created.id && !i.id.startsWith('optimistic-'),
                ),
              ]
            : [created],
        );
        qc.setQueryData(keys.detail(created.id), created);
      },
      onSettled: () => {
        qc.invalidateQueries({ queryKey: keys.lists, refetchType: 'active' });
      },
    });
  };

  const useUpdate = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, patch }: { id: T['id']; patch: UpdatePayload<T> }) =>
        client.patch<UpdatePayload<T>, T>(`${path}/${id}`, patch),
      onMutate: async ({ id, patch }) => {
        await qc.cancelQueries({ queryKey: keys.all });
        const prevList = qc.getQueryData<T[]>(keys.list());
        const prevDetail = qc.getQueryData<T>(keys.detail(id));
        if (prevList) {
          qc.setQueryData<T[]>(
            keys.list(),
            prevList.map((it) =>
              it.id === id ? ({ ...it, ...patch } as T) : it,
            ),
          );
        }
        if (prevDetail) {
          qc.setQueryData<T>(keys.detail(id), { ...prevDetail, ...patch });
        }
        return { prevList, prevDetail };
      },
      onError: (_err, { id }, ctx) => {
        if (ctx?.prevList) qc.setQueryData(keys.list(), ctx.prevList);
        if (ctx?.prevDetail) qc.setQueryData(keys.detail(id), ctx.prevDetail);
      },
      onSuccess: (updated) => {
        qc.setQueryData<T[]>(keys.list(), (curr) =>
          curr ? curr.map((i) => (i.id === updated.id ? updated : i)) : curr,
        );
        qc.setQueryData<T>(keys.detail(updated.id), updated);
      },
      onSettled: (_d, _e, vars) => {
        qc.invalidateQueries({ queryKey: keys.detail(vars.id) });
      },
    });
  };

  const useDelete = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: T['id']) => client.del<void>(`${path}/${id}`),
      onMutate: async (id) => {
        await qc.cancelQueries({ queryKey: keys.all });
        const prevList = qc.getQueryData<T[]>(keys.list());
        if (prevList)
          qc.setQueryData<T[]>(
            keys.list(),
            prevList.filter((i) => i.id !== id),
          );
        return { prevList };
      },
      onError: (_err, _id, ctx) => {
        if (ctx?.prevList) qc.setQueryData(keys.list(), ctx.prevList);
      },
      onSettled: (_d, _e, id) => {
        qc.removeQueries({ queryKey: keys.detail(id) });
        qc.invalidateQueries({ queryKey: keys.lists });
      },
    });
  };

  return { keys, useList, useById, useCreate, useUpdate, useDelete };
};

// -------------------------------------
// Instantiate for Users and ToDos
// -------------------------------------
const client = createHttpClient({ baseUrl: 'https://api.example.com' });

// eslint-disable-next-line react-refresh/only-export-components
export const userResource = createCrudResource<User>({
  entity: 'users',
  path: '/users',
  client,
});
// eslint-disable-next-line react-refresh/only-export-components
export const todoResource = createCrudResource<ToDo>({
  entity: 'todos',
  path: '/todos',
  client,
});

// -------------------------------------
// Example usage in components
// -------------------------------------
// eslint-disable-next-line react-refresh/only-export-components
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// List users
export function UsersList() {
  const { data: users, isPending, error } = userResource.useList();
  if (isPending) return <p>Loading…</p>;
  if (error) return <p>Failed: {String(error.message)}</p>;
  return (
    <ul>
      {users?.map((u) => (
        <li key={u.id}>
          {u.name} {u.email ? `— ${u.email}` : ''}
        </li>
      ))}
    </ul>
  );
}

// User detail
export function UserDetail({ id }: { id: string }) {
  const { data: user, isLoading } = userResource.useById(id);
  if (isLoading) return <p>Loading…</p>;
  if (!user) return <p>Not found</p>;
  return (
    <article>
      <h2>{user.name}</h2>
      {user.email && <p>Email: {user.email}</p>}
      {typeof user.age === 'number' && <p>Age: {user.age}</p>}
    </article>
  );
}

// Create user
export function CreateUserForm() {
  const createUser = userResource.useCreate();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || ''),
      email: (formData.get('email') as string) || undefined,
      age: formData.get('age') ? Number(formData.get('age')) : undefined,
    } satisfies CreatePayload<User>;
    createUser.mutate(payload);
    form.reset();
  };
  return (
    <form onSubmit={onSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" placeholder="Email" />
      <input name="age" placeholder="Age" type="number" />
      <button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating…' : 'Create'}
      </button>
    </form>
  );
}

// Update user
export function UpdateUserButton({ id }: { id: string }) {
  const updateUser = userResource.useUpdate();
  return (
    <button
      onClick={() =>
        updateUser.mutate({
          id,
          patch: { name: `Renamed ${new Date().toLocaleTimeString()}` },
        })
      }
      disabled={updateUser.isPending}
    >
      Rename
    </button>
  );
}

// Delete user
export function DeleteUserButton({ id }: { id: string }) {
  const removeUser = userResource.useDelete();
  return (
    <button
      onClick={() => removeUser.mutate(id)}
      disabled={removeUser.isPending}
    >
      {removeUser.isPending ? 'Removing…' : 'Remove'}
    </button>
  );
}

// You can do the same with todos via `todoResource` (identical API):
// const { data: todos } = todoResource.useList()
// const getTodo = todoResource.useById(todoId)
// const createTodo = todoResource.useCreate()
// const updateTodo = todoResource.useUpdate()
// const deleteTodo = todoResource.useDelete()
