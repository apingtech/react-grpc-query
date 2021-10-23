# React gRPC Query Hook

if you are in love with React Query and you're dealing with gRPC in you're application, `react-grpc-query` is brought to you to use a simple interface to deal with streaming.

> we use `protobuf-ts v2` in the examples
> https://github.com/timostamm/protobuf-ts

## Installation and Setup Instructions

`npm i @apingtech/react-grpc-query`

or if you use `yarn`

`yard add @apingtech/react-grpc-query`

## Example:

react-grpc-query uses a global stream handler so you have only one open stream per key.

At first, create a hook for you're stream, and use useStream hook inside.
Three parameters should be specified.

-   the first one is the `key` which is a `string`
-   the second one is `stream Function` which is a callback function that should connect to your stream transport. (more on later)
-   the third parameter is called `options`

### Stream Hook Example

```ts
function useExampleStream() {
    const [data, setData] = useState([]);

    useStream('stream-name', function streamFunction() {}, {
        onSuccess(result) {
            setData(result);
        },
    });

    return {
        data,
        isLoading: !data,
    };
}
```

### Stream Hook Example with Config

Your hook can also accept some config. In this scenario, you can keep the key as a string by converting an object to `JSON` format.

```ts
function useExampleStream(config = {}) {
    const [data, setData] = useState([]);

    useStream(
        JSON.stringify({
            name: 'stream-name',
            id: config.id,
        }),
        streamFunctionWithConfig(config),
        {
            onSuccess(result) {
                setData(result);
            },
        }
    );

    return {
        data,
        isLoading: !data,
    };
}
```

### what streamFunction actually is?

streamFunction is just a pure function like this:
the cancel property lets the `react-grpc-query` stop the streaming after unmounting the component or if the key is changed.

```tsx
function streamFunction() {
    const abortController = new AbortController();

    const call = new ExampleSubscriberClient(transport).subscribe({
        id: 1,
        name: 'Lorem',
    });

    return {
        call,
        cancel: () => abortController.abort()
    };
}
```

### What about onSuccess?

The onSuccess will fire on every stream event fire.
it is recommended to store onSuccess in a useCallback.

The complete example is the [example/useExampleStream.ts](example/useExampleStream.ts)

 folder.
