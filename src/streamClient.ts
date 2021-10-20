import { Stream } from './Stream';
import type { StreamObserverOptions } from './types';

type StreamsType = {
    [key: string]: Stream<any, any, unknown>;
};

export class StreamClient {
    private timer?: any;
    private updatesInterval = 300;

    streams: StreamsType = {};
    hasOptimisticUpdates = false;

    createStream<
        TRequest extends object = object,
        TData extends object = object,
        TError = unknown
    >(options: StreamObserverOptions<TRequest, TData, TError>) {
        const { key, streamFn } = options;

        if (this.streams[key]) {
            return this.streams[key];
        }

        const stream = new Stream<TRequest, TData, TError>(this, key);
        stream.fetch(streamFn);

        this.streams[key] = stream;

        this.startOptimisticUpdates();

        return stream;
    }

    removeStream(key: string) {
        this.streams[key]?.cancel();
        delete this.streams[key];

        if (this.shouldDeleteInterval()) {
            this.clearInterval();
        }
    }

    private shouldDeleteInterval() {
        return Object.keys(this.streams).length === 0;
    }

    startOptimisticUpdates() {
        if (this.hasOptimisticUpdates) return;

        const update = () => {
            Object.values(this.streams).forEach((stream) => {
                stream.optimisticUpdate();
            });
        };
        this.hasOptimisticUpdates = true;
        this.timer = setInterval(update, this.updatesInterval);
    }

    clearInterval() {
        clearInterval(this.timer);
        this.hasOptimisticUpdates = false;
    }

    setUpdatesInterval(value: number) {
        this.updatesInterval = value;
    }
}

export const streamClient = new StreamClient();
