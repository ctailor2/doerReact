import MockAdapter from "axios-mock-adapter";
import { applyMiddleware, createStore } from "redux";
import { ApplicationAction } from "../../actions/actions";
import { Link } from "../../api/api";
import { TodoForm } from "../../api/todo";
import { ActionTypes } from "../../constants/actionTypes";
import { ApplicationStore, reducer } from "../../store";
import actionCapturingMiddleware from "../../utils/actionCapturingMiddleware";
import { client } from "../apiClient";
import todoMiddleware from "../todoMiddleware";

export default undefined;

describe('todo middleware', () => {
    const mockAdapter = new MockAdapter(client);
    let capturedActions: ApplicationAction[];
    let store: ApplicationStore;
    const list = {
        profileName: 'someListName',
        name: 'someName',
        deferredName: 'someDeferredName',
        todos: [],
        deferredTodos: [],
        unlockDuration: 0,
        _links: {
            createDeferred: {
                href: 'createDeferredHref',
            },
        },
    };

    beforeEach(() => {
        capturedActions = [];
        store = createStore(
            reducer,
            applyMiddleware(todoMiddleware, actionCapturingMiddleware(capturedActions)),
        );
        mockAdapter.reset();
    });

    it('stores the list when todo deleted', (done) => {
        const deleteLink = { href: 'deleteHref' };
        const listLink = { href: 'listHref' };
        mockAdapter.onDelete(deleteLink.href)
            .reply(202, {
                _links: {
                    list: listLink,
                },
                list,
            });
        store.dispatch({
            type: ActionTypes.DELETE_TODO_REQUEST_ACTION,
            link: deleteLink,
        });

        setTimeout(() => {
            expect(capturedActions).toContainEqual({
                type: ActionTypes.STORE_LIST_ACTION,
                list,
                listLink,
            });
            done();
        });
    });

    type TodoApplicationAction = ApplicationAction & { link: Link, todo: TodoForm };
    const todoActionScenarios: Array<{ description: string, action: TodoApplicationAction }> = [
        {
            description: 'todo creation',
            action: {
                type: ActionTypes.CREATE_TODO_REQUEST_ACTION,
                link: { href: 'createHref' },
                todo: { task: 'someTask' },
            },
        },
        {
            description: 'todo displacement',
            action: {
                type: ActionTypes.DISPLACE_TODO_REQUEST_ACTION,
                link: { href: 'displaceHref' },
                todo: { task: 'someTask' },
            },
        },
    ];

    todoActionScenarios.map((scenario) => {
        describe(scenario.description, () => {
            it('clears errors', () => {
                store.dispatch(scenario.action);

                expect(capturedActions).toContainEqual({
                    type: ActionTypes.CLEAR_ERRORS_ACTION,
                });
            });

            describe('on success', () => {
                const listLink = { href: 'listHref' };

                beforeEach(() => {
                    mockAdapter.onPost(scenario.action.link.href, scenario.action.todo)
                        .reply(201, {
                            _links: {
                                list: listLink,
                            },
                            list,
                        });
                });

                it('stores the list', (done) => {
                    store.dispatch(scenario.action);

                    setTimeout(() => {
                        expect(capturedActions).toContainEqual({
                            type: ActionTypes.STORE_LIST_ACTION,
                            list,
                            listLink,
                        });
                        done();
                    });
                });
            });

            describe('on error', () => {
                const errors = {
                    fieldErrors: [
                        {
                            field: 'task',
                            message: 'is taken',
                        },
                    ],
                    globalErrors: [],
                };

                beforeEach(() => {
                    mockAdapter.onPost(scenario.action.link.href, scenario.action.todo)
                        .reply(400, errors);
                });

                it('stores the errors', (done) => {
                    store.dispatch(scenario.action);

                    setTimeout(() => {
                        expect(capturedActions).toContainEqual({
                            type: ActionTypes.STORE_ERRORS_ACTION,
                            errors,
                        });
                        done();
                    });
                });
            });
        });
    });

    type EmptyApplicationAction = ApplicationAction & { link: Link };
    const emptyActionScenarios: Array<{ description: string, action: EmptyApplicationAction }> = [
        {
            description: 'todo completion',
            action: {
                type: ActionTypes.COMPLETE_TODO_REQUEST_ACTION,
                link: { href: 'completeHref' },
            },
        },
        {
            description: 'moving todos',
            action: {
                type: ActionTypes.MOVE_TODO_REQUEST_ACTION,
                link: { href: 'moveHref' },
            },
        },
        {
            description: 'pulling todos',
            action: {
                type: ActionTypes.PULL_TODOS_REQUEST_ACTION,
                link: { href: 'pullHref' },
            },
        },
        {
            description: 'escalating todos',
            action: {
                type: ActionTypes.ESCALATE_TODOS_REQUEST_ACTION,
                link: { href: 'escalateHref' },
            },
        },
    ];

    emptyActionScenarios.map((scenario) => {
        describe(scenario.description, () => {
            it('stores the list on success', (done) => {
                store.dispatch(scenario.action);

                const listLink = { href: 'listHref' };
                mockAdapter.onPost(scenario.action.link.href)
                    .reply(202, {
                        _links: {
                            list: listLink,
                        },
                        list,
                    });

                setTimeout(() => {
                    expect(capturedActions).toContainEqual({
                        type: ActionTypes.STORE_LIST_ACTION,
                        list,
                        listLink,
                    });
                    done();
                });
            });
        });
    });

    describe('updating todos', () => {
        const action: ApplicationAction = {
            type: ActionTypes.UPDATE_TODO_REQUEST_ACTION,
            link: { href: 'updateHref' },
            todo: { task: 'someTask' },
        };

        it('clears errors', () => {
            store.dispatch(action);

            expect(capturedActions).toContainEqual({
                type: ActionTypes.CLEAR_ERRORS_ACTION,
            });
        });

        describe('on success', () => {
            const listLink = { href: 'listHref' };

            beforeEach(() => {
                mockAdapter.onPut(action.link.href, action.todo)
                    .reply(202, {
                        _links: {
                            list: listLink,
                        },
                        list,
                    });
            });

            it('stores the list', (done) => {
                store.dispatch(action);

                setTimeout(() => {
                    expect(capturedActions).toContainEqual({
                        type: ActionTypes.STORE_LIST_ACTION,
                        list,
                        listLink,
                    });
                    done();
                });
            });
        });

        describe('on error', () => {
            const errors = {
                fieldErrors: [
                    {
                        field: 'task',
                        message: 'is taken',
                    },
                ],
                globalErrors: [],
            };

            beforeEach(() => {
                mockAdapter.onPut(action.link.href, action.todo)
                    .reply(400, errors);
            });

            it('stores the errors', (done) => {
                store.dispatch(action);

                setTimeout(() => {
                    expect(capturedActions).toContainEqual({
                        type: ActionTypes.STORE_ERRORS_ACTION,
                        errors,
                    });
                    done();
                });
            });
        });
    });
});
