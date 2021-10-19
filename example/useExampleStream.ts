import { useCallback, useState } from 'react';
import { StoppableStreamingCall, useStream } from '../dist';
import {
    ExampleResponseEvent,
    ExampleSubscribeRequest,
} from './services/example_subscriber';
import { ExampleSubscriberClient } from './services/example_subscriber.client';
import transport from './transport';

function streamFn() {
    const abortController = new AbortController();

    const call = new ExampleSubscriberClient(transport).subscribe({
        id: 1,
        name: 'Lorem',
    }) as StoppableStreamingCall<ExampleSubscribeRequest, ExampleResponseEvent>;

    call.cancel = () => {
        abortController.abort();
    };

    return call;
}

export default function useExampleStream() {
    const [data, setData] = useState([]);
    const onSuccess = useCallback((result) => {
        setData(result);
    }, []);

    useStream('example', streamFn, {
        onSuccess,
    });

    return {
        data,
        isLoading: !data,
    };
}
