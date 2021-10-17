import { RpcError, ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import { useEffect, useMemo } from "react";
import { streamClient } from "./streamClient";
import { StreamObserver } from "./streamObserver";
import { StreamFunction, StreamOptions } from "./types";

export type StoppableStreamingCall<
    I extends object = object,
    O extends object = object
> = ServerStreamingCall<I, O> & {
    cancel(): void;
};

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
