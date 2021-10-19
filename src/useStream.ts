import type { RpcError } from '@protobuf-ts/runtime-rpc';
import { useEffect, useMemo } from 'react';
import { streamClient } from './streamClient';
import { StreamObserver } from './streamObserver';
import type { StreamFunction, StreamOptions } from './types';

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
            streamClient.defaultStreamObserverOptions<TRequest, TData, TError>(
                key,
                streamFn,
                options
            ),
        [options]
    );

    const observer = useMemo(
        () =>
            new StreamObserver<TRequest, TData>(streamClient, defaultedOptions),
        []
    );

    useEffect(() => {
        const unsubscribe = observer.subscribe();

        return () => {
            unsubscribe();
        };
    }, [key]);

    useEffect(() => {
        observer.setOptions(defaultedOptions);
    }, [defaultedOptions]);
}
