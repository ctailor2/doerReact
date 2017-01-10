jest.unmock('../sagaHelper');
jest.unmock('../sessionSaga');
jest.unmock('../../actions/sessionActions');
jest.unmock('../../actions/todoActions');

import {
    watchSignupRequest,
    signupRequest,
    watchLoginRequest,
    loginRequest,
    watchLogoutRequest,
    logoutRequest,
    watchStoreSession,
    storeSession
} from '../sessionSaga';
import {takeLatest, takeEvery} from 'redux-saga';
import {call, put} from 'redux-saga/effects';
import {postData} from '../sagaHelper';
import {browserHistory} from 'react-router';

describe('watchSignupRequest', () => {
    let iterator = watchSignupRequest();

    it('calls signup request saga with latest signup request action', () => {
        expect(iterator.next().value).toEqual(takeLatest('SIGNUP_REQUEST_ACTION', signupRequest).next().value);
    });
});

describe('signupRequest', () => {
    let iterator;

    let action = {
        type: 'SIGNUP_REQUEST_ACTION',
        data: {cool: 'beans'}
    };

    beforeEach(() => {
        iterator = signupRequest(action);
    });

    it('calls signup endpoint with action data', () => {
        expect(iterator.next().value).toEqual(call(postData, '/v1/signup', action.data));
    });

    describe('on request success', () => {
        it('fires store session action', () => {
            iterator.next();
            expect(iterator.next({response: {data: {token: 'tokenz'}}}).value)
                .toEqual(put({type: 'STORE_SESSION_ACTION', token: 'tokenz'}));
        });
    });
});

describe('watchLoginRequest', () => {
    let iterator = watchLoginRequest();

    it('calls login request saga with latest login request action', () => {
        expect(iterator.next().value).toEqual(takeLatest('LOGIN_REQUEST_ACTION', loginRequest).next().value);
    });
});

describe('loginRequest', () => {
    let iterator;

    let action = {
        type: 'LOGIN_REQUEST_ACTION',
        data: {cool: 'beans'}
    };

    beforeEach(() => {
        iterator = loginRequest(action);
    });

    it('calls login endpoint with action data', () => {
        expect(iterator.next().value).toEqual(call(postData, '/v1/login', action.data));
    });

    describe('on request success', () => {
        it('fires store session action', () => {
            iterator.next();
            expect(iterator.next({response: {data: {token: 'tokenz'}}}).value)
                .toEqual(put({type: 'STORE_SESSION_ACTION', token: 'tokenz'}));
        });
    });
});

describe('logoutRequest', () => {
    let iterator;

    let action = {
        type: 'LOGOUT_REQUEST_ACTION'
    };

    beforeEach(() => {
        localStorage.getItem = jest.fn(() => {return 'socooltoken'});
        localStorage.removeItem = jest.fn();
        browserHistory.push = jest.fn();
        iterator = logoutRequest(action);
    });

    describe('on request success', () => {
        it('removes token from localStorage', () => {
            iterator.next()
            expect(localStorage.removeItem).toBeCalledWith('sessionToken');
        });

        it('redirects to login', () => {
            iterator.next()
            iterator.next()
            expect(browserHistory.push).toBeCalledWith('/login');
        });
    });
});

describe('watchLogoutRequest', () => {
    let iterator = watchLogoutRequest();

    it('calls logout request saga with latest logout request action', () => {
        expect(iterator.next().value).toEqual(takeLatest('LOGOUT_REQUEST_ACTION', logoutRequest).next().value);
    });
});

describe('storeSession', () => {
    let iterator;

    let action = {
        type: 'STORE_SESSION_ACTION',
        token: 'wowCoolToken'
    };

    beforeEach(() => {
        localStorage.setItem = jest.fn();
        browserHistory.push = jest.fn();
        iterator = storeSession(action);
    });

    it('sets token on localStorage', () => {
        iterator.next();
        expect(localStorage.setItem).toBeCalledWith('sessionToken', 'wowCoolToken');
    });

    it('fires get todos request action for immediately scheduled todos', () => {
        iterator.next();
        expect(iterator.next().value)
            .toEqual(put({type: 'GET_TODOS_REQUEST_ACTION', scheduling: 'now'}));
    });

    it('redirects to the root', () => {
        iterator.next();
        iterator.next();
        iterator.next();
        expect(browserHistory.push).toBeCalledWith('/');
    });
});

describe('watchStoreSession', () => {
	let iterator = watchStoreSession();

	it('calls store session saga with every store session action', () => {
        expect(iterator.next().value).toEqual(takeEvery('STORE_SESSION_ACTION', storeSession).next().value);
	});
});