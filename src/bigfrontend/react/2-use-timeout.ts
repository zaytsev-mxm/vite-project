// https://bigfrontend.dev/react/usetimeout

/**
 * Task was:
 *
 * Create a hook to easily use setTimeout(callback, delay).
 *
 * reset the timer if delay changes
 * DO NOT reset the timer if only callback changes
 */

import {useEffect, useRef} from "react";

export function useTimeout(callback: () => void, delay: number) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            callbackRef.current();
        }, delay);

        return function cleanup() {
            clearTimeout(timeout);
        }
    }, [delay]);
}