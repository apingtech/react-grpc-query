import type { RpcError } from '@protobuf-ts/runtime-rpc';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { streamClient } from './streamClient';
import { StreamObserver } from './streamObserver';
import type { StreamFunction, StreamOptions } from './types';
import { defaultStreamObserverOptions } from './utils';

export function useStream<
    TRequest extends object = object,
    TData extends object = object,
    TError = RpcError
>(
    key: string,
    streamFn: StreamFunction<TRequest, TData>,
    options: StreamOptions<TData>
) {
    const defaultedOptions = useMemo(
        () =>
            defaultStreamObserverOptions<TRequest, TData, TError>(
                key,
                streamFn,
                options
            ),
        [options]
    );

    const observer = useMemo(
        () =>
            new StreamObserver<TRequest, TData, TError>(
                streamClient,
                defaultedOptions
            ),
        []
    );

    useLayoutEffect(() => {
        observer.setOptions(defaultedOptions);
    }, [defaultedOptions]);

    useEffect(() => {
        const unsubscribe = observer.subscribe();

        return () => {
            unsubscribe();
        };
    }, [key]);
}
