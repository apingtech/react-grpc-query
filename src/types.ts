import { StoppableStreamingCall } from "./useStream";

export interface StreamOptions<Data = unknown, TError = unknown> {
    enabled?: boolean;
    onSuccess?(data: Data): void;
    onError?(error: TError): void;
}

export interface StreamObserverOptions<
    TRequest extends object = object,
    TData extends object = object,
    TError = unknown
> extends StreamOptions<TData, TError> {
    key: string;
    streamFn: StreamFunction<TRequest, TData>;
}

export type StreamFunction<
    I extends object = object,
    O extends object = object
> = () => StoppableStreamingCall<I, O>;
