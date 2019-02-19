import axios, { AxiosRequestConfig } from 'axios';
import * as io from 'io-ts';
import { Link, LoginInfo, SignupInfo } from '../actions/sessionActions';

export const client = axios.create();

client.defaults.headers = {
    'Content-Type': 'application/json',
};

type Commands =
    | 'signup'
    | 'login';

const SessionResponseIO = io.interface({
    session: io.interface({
        token: io.string,
    }),
    _links: io.interface({
        root: io.interface({
            href: io.string,
        }),
    }),
});

const ErrorResponseIO = io.interface({
    fieldErrors: io.array(io.interface({
        field: io.string,
        message: io.string,
    })),
    globalErrors: io.array(io.interface({
        message: io.string,
    })),
});

const responseValidators = {
    signup: SessionResponseIO,
    login: SessionResponseIO,
    error: ErrorResponseIO,
};

interface Requests {
    signup: SignupInfo;
    login: LoginInfo;
}

interface SuccessResponses {
    signup: io.TypeOf<typeof SessionResponseIO>;
    login: io.TypeOf<typeof SessionResponseIO>;
}

type ErrorResponse = io.TypeOf<typeof ErrorResponseIO>;

export function fetchData(url: string, configs?: AxiosRequestConfig) {
    return client.get(url, configs)
        .then((response) => ({ response }))
        .catch((error) => ({ error }));
}

export function postData(url: string, data?: any, configs?: AxiosRequestConfig) {
    return client.post(url, data, configs)
        .then((response) => ({ response }))
        .catch((error) => ({ error }));
}

export function postCommand<Command extends Commands>(
    command: Command,
    link: Link,
    request: Requests[Command],
    onSuccess: (response: SuccessResponses[Command]) => void,
    // tslint:disable-next-line:no-console
    onError: (errorResponse: ErrorResponse) => void = (errorResponse) => console.log(errorResponse)): void {
    client.post(link.href, request)
        .then((successResponse) => {
            const validation = responseValidators[command].decode(successResponse.data);
            if (validation.isRight()) {
                onSuccess(validation.value);
            }
        })
        .catch(({ response: errorResponse }) => {
            const validation = responseValidators.error.decode(errorResponse.data);
            if (validation.isRight()) {
                onError(validation.value);
            }
        });
}

export function deleteData(url: string, configs?: AxiosRequestConfig) {
    return client.delete(url, configs)
        .then((response) => ({ response }))
        .catch((error) => ({ error }));
}

export function putData(url: string, data?: any, configs?: AxiosRequestConfig) {
    return client.put(url, data, configs)
        .then((response) => ({ response }))
        .catch((error) => ({ error }));
}
