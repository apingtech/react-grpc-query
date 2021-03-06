import { Stream } from './Stream';
import { StreamClient } from './streamClient';
import type { StreamObserverOptions, StreamOptions } from './types';

export class StreamObserver<
    TRequest extends object = object,
    TData extends object = object,
    TError = unknown
> {
    client: StreamClient;

    options!: StreamObserverOptions<TRequest, TData, TError>;

    stream?: Stream<any, any, TError>;

    constructor(
        client: StreamClient,
        options: StreamObserverOptions<TRequest, TData, TError>
    ) {
        this.client = client;
        this.setOptions(options);
    }

    onUpdate(data: TData) {
        if (this.options?.onSuccess && this.options.enabled) {
            this.options.onSuccess(data);
        }
    }

    onError(error: TError) {
        if (this.options?.onError && this.options.enabled) {
            this.options.onError(error);
        }
    }

    subscribe() {
        this.stream = this.client.createStream(this.options);
        this.stream?.addObserver(this);
        return () => this.unsubscribe();
    }

    unsubscribe() {
        if (this.stream) {
            this.stream.removeObserver(this);
        }
    }

    setOptions(options: StreamObserverOptions<TRequest, TData, TError>) {
        const defaultOptions: Partial<StreamOptions> = {
            enabled: true,
            optimisticUpdate: true,
        };

        this.options = {
            ...defaultOptions,
            ...options,
        };
    }
}
