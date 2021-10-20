import { StreamClient } from './streamClient';
import { StreamObserver } from './streamObserver';
import type { CancelableStreamingCall, StreamFunction } from './types';

export class Stream<
    TRequest extends object = object,
    TData extends object = object,
    TError = unknown
> {
    private firstUpdate = false;

    key: string;

    latestData?: TData;

    observers: StreamObserver[] = [];

    client!: StreamClient;

    stream!: CancelableStreamingCall<TRequest, TData>;

    constructor(streamClient: StreamClient, key: string) {
        this.client = streamClient;
        this.key = key;
    }

    fetch = async (streamFn: StreamFunction<TRequest, TData>) => {
        this.stream = streamFn();
        const call = this.stream.call;

        try {
            for await (const response of call.responses) {
                this.onUpdate(response);

                this.latestData = response;
            }
        } catch (error) {
            this.onError(error as TError);
        }
    };

    onUpdate(response: TData) {
        this.observers.forEach((observer) => {
            if (!observer.options.optimisticUpdate || this.firstUpdate) {
                observer.onUpdate(response);
                this.firstUpdate = false;
            }
        });
    }

    onError(error: TError) {
        this.observers.forEach((observer) => {
            observer.onError(error);
        });
    }

    optimisticUpdate() {
        if (this.latestData) {
            this.observers.forEach((observer) => {
                if (observer.options.optimisticUpdate) {
                    observer.onUpdate(this.latestData!);
                }
            });
            this.latestData = undefined;
        }
    }

    addObserver(observer: StreamObserver) {
        this.observers.push(observer);
    }

    removeObserver(observer: StreamObserver) {
        this.observers = this.observers.filter((item) => item !== observer);
        if (this.observers.length === 0) {
            this.cancel();
            this.client.removeStream(this.key);
        }
    }

    cancel() {
        if (typeof this.stream.cancel === 'function') {
            this.stream.cancel();
        }
    }
}
