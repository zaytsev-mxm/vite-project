import { type HttpClientOptions, HttpError } from './ChatGPTQuery.tsx';
export const createHttpClient = ({
  baseUrl,
  defaultHeaders = {},
}: HttpClientOptions) => {
  const _fetch = async <T>(
    path: string,
    init?: RequestInit & { signal?: AbortSignal },
  ): Promise<T> => {
    const controller = new AbortController();
    const signal = init?.signal ?? controller.signal;

    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...defaultHeaders,
        ...(init?.headers || {}),
      },
      signal,
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson
      ? await res.json().catch(() => undefined)
      : await res.text().catch(() => undefined);

    if (!res.ok) {
      const message =
        (isJson && (body as any)?.message) ||
        res.statusText ||
        'Request failed';
      throw new HttpError(message, res.status, res.url, body);
    }

    return body as T;
  };

  const get = <T>(path: string, init?: RequestInit) =>
    _fetch<T>(path, { ...init, method: 'GET' });
  const post = <TReq, TRes>(path: string, body: TReq, init?: RequestInit) =>
    _fetch<TRes>(path, { ...init, method: 'POST', body: JSON.stringify(body) });
  const patch = <TReq, TRes>(path: string, body: TReq, init?: RequestInit) =>
    _fetch<TRes>(path, {
      ...init,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  const del = <TRes>(path: string, init?: RequestInit) =>
    _fetch<TRes>(path, { ...init, method: 'DELETE' });

  return { get, post, patch, del };
};
