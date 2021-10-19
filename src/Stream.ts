import { streamClient } from './streamClient';
import { StreamObserver } from './streamObserver';
import type { StreamFunction, StoppableStreamingCall } from './types';

export class Stream<
    TRequest extends object = object,
    TData extends object = object,
    TError = unknown
> {
    key: string;

    observers: StreamObserver[] = [];

    call!: StoppableStreamingCall<TRequest, TData>;

    constructor(key: string) {
        this.key = key;
    }

    fetch = async (streamFn: StreamFunction<TRequest, TData>) => {
        const call = streamFn();

        this.call = call;
        try {
            for await (const response of call.responses) {
                this.updated(response);
            }
        } catch (error) {
            this.failed(error as TError);
        }
    };

    updated(response: TData) {
        this.observers.forEach((observer) => {
            observer.updateResult(response);
        });
    }

    failed(error: TError) {
        this.observers.forEach((observer) => {
            observer.failedResult(error);
        });
    }

    addObserver(observer: StreamObserver) {
        this.observers.push(observer);
    }

    removeObserver(observer: StreamObserver) {
        this.observers = this.observers.filter((item) => item !== observer);
        if (this.observers.length === 0) {
            this.cancel();
            streamClient.removeStream(this.key);
        }
    }

    cancel() {
        if (typeof this.call.cancel === 'function') {
            this.call.cancel();
        }
    }
}
