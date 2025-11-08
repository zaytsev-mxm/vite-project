import {useState} from "react";

type Output<T, E> = {
    data?: T
    error?: E
};

export function useSWR<T = unknown, E = unknown>(
    _key: string,
    fetcher: () => T | Promise<T>
): Output<T, E> {
    const [state, setState] = useState<Output<T, E>>({});

    return state;
}