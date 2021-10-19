import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

const transport = new GrpcWebFetchTransport({
    baseUrl: '',
    format: 'binary',
    interceptors: [
        {
            interceptUnary(next, method, input, options) {
                const token = localStorage.getItem('token');

                if (token) {
                    options.meta = {
                        ...options.meta,
                        authorization: token,
                    };
                }
                return next(method, input, options);
            },
        },
    ],
});
export default transport;
