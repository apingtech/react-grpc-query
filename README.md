<p align="center">

  <a aria-label="NPM package" href="https://www.npmjs.com/package/react-grpc-query-logo">
    <img alt="" src="https://img.shields.io/npm/v/react-grpc-query-logo.svg?style=for-the-badge&labelColor=000000">
  </a>

  <a aria-label="Minified Size" href="https://www.npmjs.com/package/react-grpc-query-logo">
    <img alt="" src="https://img.shields.io/bundlephobia/min/react-grpc-query-logo.svg?style=for-the-badge&labelColor=000000">
  </a>
 
</p>

# React gRPC Query Hook

If you are in love with React Query and are dealing with gRPC in your React application, `react-grpc-query` is here to help you use a simple interface to deal with streaming.

We use `protobuf-ts@2.*` in the examples https://github.com/timostamm/protobuf-ts

## Installation and Setup Instructions

`npm i @apingtech/react-grpc-query`

or if you use yarn

`yard add @apingtech/react-grpc-query`

## Example:

react-grpc-query uses a global stream handler; hence you have only one open stream per key.

At first, create a hook for you're stream, and use the useStream hook inside.
You should specify three parameters.

-   the first one is the `key` which is a `string`
-   the second one is `stream Function`, a callback function that should connect to your stream transport. (more on later)
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

Your React Hook can also accept some config. In this scenario, you can keep the key as a string by converting an object to `JSON`.

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

### what stream function is?

The stream function is just a pure function just like this:

```tsx
function streamFunction(abortController: AbortController) {
    const call = new ExampleSubscriberClient(transport).subscribe(
        {
            id: 1,
            name: 'Lorem',
        },
        {
            abort: abortController.signal,
        }
    );

    return call;
}
```

### What about onSuccess?

The onSuccess will run on every stream update event running.
We recommended you to store onSuccess in a useCallback.

The complete example is the [example/useExampleStream.ts](example/useExampleStream.ts)

folder.
