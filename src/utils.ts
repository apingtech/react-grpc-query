import { StreamFunction, StreamOptions } from './types';

export function defaultStreamObserverOptions<
    TRequest extends object,
    TData extends object,
    TError = unknown
>(
    key: string,
    streamFn: StreamFunction<TRequest, TData>,
    options: StreamOptions<TData, TError>
) {
    return {
        streamFn,
        key,
        ...options,
    };
}
