import { Stream } from './Stream';
import type {
    StreamFunction,
    StreamObserverOptions,
    StreamOptions,
} from './types';

type StreamsType = {
    [key: string]: Stream<any, any>;
};

export class StreamClient<
    TRequest extends object = object,
    TData extends object = object,
    TError = unknown
> {
    streams: StreamsType = {};

    createStream(options: StreamObserverOptions<TRequest, TData, TError>) {
        const { key, streamFn } = options;

        if (this.streams[key]) {
            return this.streams[key];
        }

        const stream = new Stream<TRequest, TData, TError>(key);
        stream.fetch(streamFn);

        this.streams[key] = stream;

        return stream;
    }

    removeStream(key: string) {
        this.streams[key]?.cancel();
        delete this.streams[key];
    }

    defaultStreamObserverOptions<
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
}

export const streamClient = new StreamClient();

// @ts-ignore
window.streamClient = streamClient;
