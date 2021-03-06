jest.useFakeTimers();

import { configure, shallow, ShallowWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import _ from 'lodash';
import React from 'react';
import {
    Modal,
    Tab,
    Tabs,
} from 'react-bootstrap';
import { Link } from '../../../api/api';
import { List, ListAndLink } from '../../../api/list';
import { Todo as DomainTodo } from '../../../api/todo';
import ListSelector from '../../ListSelector';
import TaskForm from '../../TaskForm';
import Todo from '../../Todo';
import { App, Props, State } from '../App';

describe('App', () => {
    let tree: ShallowWrapper<Props, State, any>;
    let listAndLink: ListAndLink;
    let selectedList: string;
    let todoNowLink: Link;
    let todoLaterLink: Link;
    let pullLink: Link;
    let escalateLink: Link;
    let displaceLink: Link;
    let listLink: Link;
    let mockDisplaceTodoActionFn: jest.Mock;
    let mockPullTodosActionFn: jest.Mock;
    let mockEscalateTodosActionFn: jest.Mock;
    let mockMoveTodoActionFn: jest.Mock;
    let mockUnlockListActionFn: jest.Mock;
    let mockGetListActionFn: jest.Mock;
    let eventListenerCallbacks: { [eventKey: string]: (event: any) => void };

    beforeEach(() => {
        configure({ adapter: new Adapter() });
        mockDisplaceTodoActionFn = jest.fn();
        mockMoveTodoActionFn = jest.fn();
        mockPullTodosActionFn = jest.fn();
        mockEscalateTodosActionFn = jest.fn();
        mockUnlockListActionFn = jest.fn();
        mockGetListActionFn = jest.fn();
        eventListenerCallbacks = {};
        document.addEventListener = jest.fn((event, callback) => {
            eventListenerCallbacks[event] = callback;
        });
        document.removeEventListener = jest.fn((event) => {
            delete eventListenerCallbacks[event];
        });
        todoNowLink = { href: 'http://some.api/todoNow' };
        todoLaterLink = { href: 'http://some.api/todoLater' };
        pullLink = { href: 'http://some.api/pullTodos' };
        escalateLink = { href: 'http://some.api/escalateTodos' };
        displaceLink = { href: 'http://some.api/displaceTodo' };
        listLink = { href: 'http://some.api/list' };
        listAndLink = {
            list: {
                name: 'name',
                deferredName: 'deferredname',
                unlockDuration: 1700900,
                todos: [],
                deferredTodos: [],
                _links: {
                    create: todoNowLink,
                    createDeferred: todoLaterLink,
                    completed: { href: '' },
                },
            },
            listLink,
        };
        selectedList = 'someSelectedList';
        tree = shallow(<App 
            listAndLink={listAndLink}
            selectedList={selectedList}
            displaceTodoRequestAction={mockDisplaceTodoActionFn}
            moveTodoRequestAction={mockMoveTodoActionFn}
            pullTodosRequestAction={mockPullTodosActionFn}
            escalateTodosRequestAction={mockEscalateTodosActionFn}
            unlockListRequestAction={mockUnlockListActionFn}
            getListRequestAction={mockGetListActionFn} />);
    });

    it('renders', () => {
        expect(tree.length).toBe(1);
    });

    it('has default state', () => {
        expect(tree.state().todo).toEqual({ task: '' });
        expect(tree.state().submitting).toEqual(false);
        expect(tree.state().showUnlockConfirmation).toEqual(false);
        expect(tree.state().activeTab).toEqual('name');
        expect(tree.state().unlockDuration).toEqual(1700900);
    });

    describe('when mounted', () => {
        beforeEach(() => {
            tree.instance().componentDidMount();
        });

        it('should register an event listener with the document to capture changes in visibility', () => {
            expect(document.addEventListener).toBeCalled();
            expect(eventListenerCallbacks.visibilitychange).toBeDefined();
        });

        describe('visibility change callback', () => {
            let visibilityChangeCallback: (event: any) => void;

            beforeEach(() => {
                visibilityChangeCallback = eventListenerCallbacks.visibilitychange;
            });

            it('when document is hidden', () => {
                visibilityChangeCallback({ target: { hidden: true } });
                jest.runAllTimers();
                expect(tree.state().unlockDuration).toEqual(1700900);
            });

            it('when document is visible', () => {
                visibilityChangeCallback({ target: { hidden: false } });
                expect(mockGetListActionFn).toBeCalledWith(selectedList, listLink);
            });
        });
    });

    describe('when unmounted', () => {
        beforeEach(() => {
            tree.instance().componentDidMount();
            tree.instance().componentWillUnmount();
        });

        it('should remove the event listener from the document that is capturing changes in visibility', () => {
            expect(document.removeEventListener).toBeCalled();
            expect(eventListenerCallbacks.visibilitychange).toBeUndefined();
        });
    });

    describe('upon receiving props', () => {
        describe('when unlockDuration is currently > 0', () => {
            describe('when unlockDuration from props is greater than current unlockDuration', () => {
                let listWithProps;

                beforeEach(() => {
                    listWithProps = _.clone(listAndLink);
                    listWithProps.list.unlockDuration = 1800000;
                    tree.setProps({ listAndLink: listWithProps });
                });

                it('does not set unlockDuration state', () => {
                    expect(tree.state().unlockDuration).toEqual(1700900);
                });

                it('decrements unlockDuration after a second has elapsed', () => {
                    jest.runTimersToTime(1000);
                    expect(tree.state().unlockDuration).toEqual(1699900);
                });
            });

            describe('when unlockDuration from props is less than current unlockDuration', () => {
                let listWithProps;

                beforeEach(() => {
                    listWithProps = _.clone(listAndLink);
                    listWithProps.list.unlockDuration = 15250;
                    tree.setProps({ listAndLink: listWithProps });
                });

                it('sets unlockDuration state', () => {
                    expect(tree.state().unlockDuration).toEqual(15250);
                });

                it('decrements unlockDuration after a second has elapsed', () => {
                    jest.runTimersToTime(1000);
                    expect(tree.state().unlockDuration).toEqual(14250);
                });
            });
        });

        describe('when unlockDuration is currently 0', () => {
            let listWithProps;

            beforeEach(() => {
                jest.runAllTimers();
                listWithProps = _.clone(listAndLink);
                listWithProps.list.unlockDuration = 15250;
                tree.setProps({ listAndLink: listWithProps });
            });

            it('sets unlockDuration state', () => {
                expect(tree.state().unlockDuration).toEqual(15250);
            });

            it('decrements unlockDuration after a second has elapsed', () => {
                jest.runTimersToTime(1000);
                expect(tree.state().unlockDuration).toEqual(14250);
            });
        });
    });

    describe('unlockDuration state', () => {
        it('decrements after a second has elapsed', () => {
            jest.runTimersToTime(1000);
            expect(tree.state().unlockDuration).toEqual(1699900);
        });

        it('does not decrement when less than a second has passed', () => {
            jest.runTimersToTime(999);
            expect(tree.state().unlockDuration).toEqual(1700900);
        });

        it('does not decrement unlockDuration past zero', () => {
            jest.runTimersToTime(3000000);
            expect(tree.state().unlockDuration).toEqual(0);
        });
    });

    describe('when unlockDuration reaches 0', () => {
        beforeEach(() => {
            tree.setState({ activeTab: listAndLink.list.deferredName });
            jest.runAllTimers();
        });

        it('fires get list request action with listLink when unlockDuration reaches 0', () => {
            expect(mockGetListActionFn).toBeCalledWith(selectedList, listLink);
        });

        it('updates activeTab state', () => {
            expect(tree.state().activeTab).toEqual(listAndLink.list.name);
        });
    });

    describe('ListSelector', () => {
        let listSelector: ShallowWrapper<any>;

        beforeEach(() => {
            listSelector = tree.find(ListSelector);
        });

        it('renders', () => {
            expect(listSelector.exists()).toBe(true);
        });

        it('has the selectedList', () => {
            expect(listSelector.prop('selectedList')).toEqual(selectedList);
        });
    });

    describe('TaskForm', () => {
        let taskForm: ShallowWrapper<any>;

        beforeEach(() => {
            taskForm = tree.find(TaskForm);
        });

        it('renders', () => {
            expect(taskForm.length).toEqual(1);
        });

        it('has task matching state', () => {
            expect(taskForm.prop('task')).toEqual('');
        });

        it('has primaryButtonName matching list name', () => {
            expect(taskForm.prop('primaryButtonName')).toEqual('name');
        });

        it('has secondaryButtonName matching list deferredName', () => {
            expect(taskForm.prop('secondaryButtonName')).toEqual('deferredname');
        });

        it('has submitting matching state', () => {
            expect(taskForm.prop('submitting')).toBe(false);
        });

        it('has links matching list links', () => {
            expect(taskForm.prop('links')).toEqual(listAndLink.list._links);
        });

        describe('task change handler', () => {
            const task = 'someTask';

            beforeEach(() => {
                taskForm.prop('handleTaskChange')(task);
            });

            it('sets task state', () => {
                expect(tree.state().todo).toEqual({ task });
            });
        });

        describe('submit change handler', () => {
            const isSubmitting = true;

            beforeEach(() => {
                taskForm.prop('handleSubmitChange')(isSubmitting);
            });

            it('sets submitting state', () => {
                expect(tree.state().submitting).toBe(isSubmitting);
            });
        });
    });

    describe('tabs', () => {
        let tabs: ShallowWrapper;

        beforeEach(() => {
            const listWithProps = _.clone(listAndLink);
            listWithProps.list.unlockDuration = 0;
            tree.setProps({ listAndLink: listWithProps });
            tabs = tree.find(Tabs);
        });

        it('renders', () => {
            expect(tabs.length).toBe(1);
        });

        it('contains 2', () => {
            expect(tabs.find(Tab).length).toBe(2);
        });

        describe('for activeTab state', () => {
            beforeEach(() => {
                tree.setState({ activeTab: 'somethingElse' });
                tabs = tree.find(Tabs);
            });

            it('has the matching activeKey', () => {
                expect(tabs.prop('activeKey')).toEqual('somethingElse');
            });
        });

        describe('onSelect handler', () => {
            let handler: (tabName: string) => void;

            beforeEach(() => {
                handler = tabs.prop('onSelect');
            });

            describe('when tabKey matches list name', () => {
                beforeEach(() => {
                    handler('name');
                });

                it('updates activeTab state', () => {
                    expect(tree.state().activeTab).toEqual('name');
                });

                it('does not update showUnlockConfirmation state', () => {
                    expect(tree.state().showUnlockConfirmation).toBe(false);
                });
            });

            describe('when tabKey matches deferred list name', () => {
                beforeEach(() => {
                    handler('deferredName');
                });

                it('does not update activeTab state', () => {
                    handler('someTabKey');
                    expect(tree.state().activeTab).not.toEqual('someTabKey');
                });

                it('updates showUnlockConfirmation to true', () => {
                    handler('someTabKey');
                    expect(tree.state().showUnlockConfirmation).toEqual(true);
                });

                describe('when the unlock duration is greater than zero', () => {
                    beforeEach(() => {
                        const listWithProps = _.clone(listAndLink);
                        listWithProps.list.unlockDuration = 1700000;
                        tree.setProps({ listAndLink: listWithProps });
                    });

                    it('updates activeTab state to tabKey', () => {
                        handler('someTabKey');
                        expect(tree.state().activeTab).toEqual('someTabKey');
                    });
                });
            });
        });

        describe('first tab', () => {
            let tab: ShallowWrapper;

            beforeEach(() => {
                tab = tabs.find(Tab).at(0);
            });

            it('has eventKey matching list name', () => {
                expect(tab.prop('eventKey')).toEqual('name');
            });

            it('has Title matching title cased list name', () => {
                expect(tab.prop('title')).toEqual('Name');
            });

            describe('displace button', () => {
                let button;

                beforeEach(() => {
                    button = tab.find('ListGroupItem').find('[onClick]').find('.displace');
                });

                it('does not render by default', () => {
                    expect(button.length).toBe(0);
                });

                it('renders when the displace link is present and submitting state is true', () => {
                    const listWithDisplaceLink = _.clone(listAndLink);
                    listWithDisplaceLink.list._links.displace = displaceLink;
                    tree.setState({ submitting: true });
                    tree.setProps({ listAndLink: listWithDisplaceLink });
                    tabs = tree.find(Tabs);
                    tab = tabs.find(Tab).at(0);
                    button = tab.find('ListGroupItem').find('[onClick]').find('.displace');
                    expect(button.length).toBe(1);
                });

                it('does not render when the displace link is present and submitting state is false', () => {
                    const listWithDisplaceLink = _.clone(listAndLink);
                    listWithDisplaceLink.list._links.displace = displaceLink;
                    tree.setState({ submitting: false });
                    tree.setProps({ listAndLink: listWithDisplaceLink });
                    tabs = tree.find(Tabs);
                    tab = tabs.find(Tab).at(0);
                    button = tab.find('ListGroupItem').find('[onClick]').find('.displace');
                    expect(button.length).toBe(0);
                });

                describe('when rendered, on click', () => {
                    const todoToSubmit = { task: 'some task' };

                    beforeEach(() => {
                        const listWithDisplaceLink = _.clone(listAndLink);
                        listWithDisplaceLink.list._links.displace = displaceLink;
                        tree.setState({ todo: todoToSubmit, submitting: true });
                        tree.setProps({ listAndLink: listWithDisplaceLink });
                        tabs = tree.find(Tabs);
                        tab = tabs.find(Tab).at(0);
                        button = tab.find('ListGroupItem').find('[onClick]').find('.displace');
                        button.simulate('click');
                    });

                    it('fires displace todos action with displaceLink', () => {
                        expect(mockDisplaceTodoActionFn).toBeCalledWith(displaceLink, todoToSubmit);
                    });

                    it('toggles submitting state to false', () => {
                        expect(tree.state().submitting).toBe(false);
                    });

                    it('clears the todo task state', () => {
                        expect(tree.state().todo).toEqual({ task: '' });
                    });
                });
            });

            describe('replenish button', () => {
                let button: ShallowWrapper;

                beforeEach(() => {
                    button = tab.find('ListGroupItem').find('[onClick]').find('.refresh');
                });

                it('does not render by default', () => {
                    expect(button.length).toBe(0);
                });

                it('renders when the pull link is present', () => {
                    const listWithPullLink = _.clone(listAndLink);
                    listWithPullLink.list._links.pull = pullLink;
                    tree.setProps({ listAndLink: listWithPullLink });
                    tabs = tree.find(Tabs);
                    tab = tabs.find(Tab).at(0);
                    button = tab.find('ListGroupItem').find('[onClick]').find('.refresh');
                    expect(button.length).toBe(1);
                });

                describe('when rendered', () => {
                    beforeEach(() => {
                        const listWithPullLink = _.clone(listAndLink);
                        listWithPullLink.list._links.pull = pullLink;
                        tree.setProps({ listAndLink: listWithPullLink });
                        tabs = tree.find(Tabs);
                        tab = tabs.find(Tab).at(0);
                        button = tab.find('ListGroupItem').find('[onClick]').find('.refresh');
                    });

                    it('fires pull todos action with pullLink', () => {
                        button.simulate('click');
                        expect(mockPullTodosActionFn).toBeCalledWith(pullLink);
                    });
                });
            });
        });

        describe('second tab', () => {
            let tab: ShallowWrapper;

            beforeEach(() => {
                tab = tabs.find(Tab).at(1);
            });

            it('has eventKey matching deferredName', () => {
                expect(tab.prop('eventKey')).toEqual('deferredname');
            });

            it('has a title', () => {
                expect(tab.prop('title')).not.toBeUndefined();
            });

            it('is disabled by default', () => {
                expect(tab.prop('disabled')).toBe(true);
            });

            describe('when the unlock link is present', () => {
                beforeEach(() => {
                    const listWithUnlockLink = _.clone(listAndLink);
                    listWithUnlockLink.list._links.unlock = { href: 'http://some.api/unlock' };
                    tree.setProps({ listAndLink: listWithUnlockLink });
                    tabs = tree.find(Tabs);
                    tab = tabs.find(Tab).at(1);
                });

                it('is not disabled', () => {
                    expect(tab.prop('disabled')).toBe(false);
                });
            });

            describe('when the unlock duration is greater than zero', () => {
                let listWithProps: ListAndLink;

                beforeEach(() => {
                    listWithProps = _.clone(listAndLink);
                    listWithProps.list.unlockDuration = 1700000;
                    tree.setProps({ listAndLink: listWithProps });
                    tabs = tree.find(Tabs);
                    tab = tabs.find(Tab).at(1);
                });

                it('is not disabled', () => {
                    expect(tab.prop('disabled')).toBe(false);
                });

                describe('escalate button', () => {
                    let button: ShallowWrapper;

                    beforeEach(() => {
                        button = tab.find('ListGroupItem').find('[onClick]').find('.escalate');
                    });

                    it('does not render by default', () => {
                        expect(button.length).toBe(0);
                    });

                    it('renders when the escalate link is present', () => {
                        const listWithEscalateLink = _.clone(listWithProps);
                        listWithEscalateLink.list._links.escalate = escalateLink;
                        tree.setProps({ listAndLink: listWithEscalateLink });
                        tabs = tree.find(Tabs);
                        tab = tabs.find(Tab).at(1);
                        button = tab.find('ListGroupItem').find('[onClick]').find('.escalate');
                        expect(button.length).toBe(1);
                    });

                    describe('when rendered', () => {
                        beforeEach(() => {
                            const listWithEscalateLink = _.clone(listWithProps);
                            listWithEscalateLink.list._links.escalate = escalateLink;
                            tree.setProps({ listAndLink: listWithEscalateLink });
                            tabs = tree.find(Tabs);
                            tab = tabs.find(Tab).at(1);
                            button = tab.find('ListGroupItem').find('[onClick]').find('.escalate');
                        });

                        it('fires escalate todos action with pullLink', () => {
                            button.simulate('click');
                            expect(mockEscalateTodosActionFn).toBeCalledWith(escalateLink);
                        });
                    });
                });
            });

            describe('title', () => {
                let titleNode: ShallowWrapper;

                beforeEach(() => {
                    titleNode = shallow(tab.prop('title'));
                });

                it('contains capitalized deferredName', () => {
                    expect(titleNode.text()).toContain('Deferredname');
                });

                it('contains an icon', () => {
                    expect(titleNode.find('Glyphicon').length).toEqual(1);
                });

                describe('when the unlock duration is greater than zero', () => {
                    beforeEach(() => {
                        const listWithProps = _.clone(listAndLink);
                        listWithProps.list.unlockDuration = 1700000;
                        tree.setProps({ listAndLink: listWithProps });
                        tabs = tree.find(Tabs);
                        tab = tabs.find(Tab).at(1);
                        titleNode = shallow(tab.prop('title'));
                    });

                    it('does not contain an icon', () => {
                        expect(titleNode.find('Glyphicon').length).toEqual(0);
                    });

                    it('contains the unlock duration in minutes and seconds', () => {
                        expect(titleNode.text()).toContain('28:20');
                    });
                });
            });
        });
    });

    describe('modal', () => {
        let modal: ShallowWrapper<any>;

        beforeEach(() => {
            modal = tree.find(Modal).at(0);
        });

        it('renders', () => {
            expect(modal.length).toEqual(1);
        });

        it('has show state matching showUnlockConfirmation', () => {
            tree.setState({ showUnlockConfirmation: true });
            modal = tree.find(Modal).at(0);
            expect(modal.prop('show')).toEqual(true);
        });

        describe('when rendered', () => {
            let unlockLink: Link;

            beforeEach(() => {
                tree.setState({ showUnlockConfirmation: true });
                const listWithUnlockLink = _.clone(listAndLink);
                unlockLink = { href: 'http://some.api/unlock' };
                listWithUnlockLink.list._links.unlock = unlockLink;
                tree.setProps({ listAndLink: listWithUnlockLink });
                modal = tree.find(Modal).at(0);
            });

            describe('title', () => {
                let title: ShallowWrapper;

                beforeEach(() => {
                    title = modal.find(Modal.Title);
                });

                it('renders', () => {
                    expect(title.exists()).toBe(true);
                });

                it('has a prompt', () => {
                    expect(title.childAt(0).text()).toEqual('Unlock deferredname list?');
                });
            });

            describe('body', () => {
                let body: ShallowWrapper;

                beforeEach(() => {
                    body = modal.find(Modal.Body);
                });

                it('renders', () => {
                    expect(body.exists()).toBe(true);
                });

                it('has a prompt', () => {
                    expect(body.childAt(0).text()).toEqual('The deferredname list can only be unlocked once a day.');
                });
            });

            describe('footer', () => {
                let footer: ShallowWrapper;

                beforeEach(() => {
                    footer = modal.find(Modal.Footer);
                });

                it('renders', () => {
                    expect(footer.length).toEqual(1);
                });

                it('contains 2 buttons', () => {
                    expect(footer.find('Button').length).toEqual(2);
                });

                describe('first button', () => {
                    let button: ShallowWrapper;

                    beforeEach(() => {
                        button = footer.find('Button').at(0);
                    });

                    it('updates showUnlockConfirmation state to false on click', () => {
                        button.simulate('click');
                        expect(tree.state().showUnlockConfirmation).toBe(false);
                    });
                });

                describe('second button', () => {
                    let button: ShallowWrapper;

                    beforeEach(() => {
                        button = footer.find('Button').at(1);
                    });

                    it('fires unlock list request action with list unlockLink', () => {
                        button.simulate('click');
                        expect(mockUnlockListActionFn).toBeCalledWith(unlockLink);
                    });

                    it('updates showUnlockConfirmation state to false on click', () => {
                        button.simulate('click');
                        expect(tree.state().showUnlockConfirmation).toBe(false);
                    });
                });
            });
        });
    });

    describe('list', () => {
        let listGroup: ShallowWrapper;

        beforeEach(() => {
            listGroup = tree.find('ListGroup');
        });

        it('renders for now and later todos', () => {
            expect(listGroup.length).toBe(2);
        });

        describe('without todos', () => {
            it('does not contain any items', () => {
                expect(listGroup.find('ListGroupItem').length).toBe(0);
            });
        });

        describe('with todos', () => {
            let todo1: DomainTodo;
            let todo2: DomainTodo;
            let laterTodo1: DomainTodo;
            let laterTodo2: DomainTodo;
            let deleteLinkOne: Link;
            let listWithProps: ListAndLink;

            beforeEach(() => {
                deleteLinkOne = { href: 'http://some.api/deleteTodoOne' };
                todo1 = {
                    task: 'thing one', _links: {
                        delete: deleteLinkOne,
                        complete: { href: '' },
                        update: { href: '' },
                        move: [],
                    },
                };
                todo2 = {
                    task: 'thing two', _links: {
                        delete: { href: 'http://some.api/deleteTodoTwo' },
                        complete: { href: '' },
                        update: { href: '' },
                        move: [],
                    },
                };
                laterTodo1 = {
                    task: 'later thing one', _links: {
                        delete: { href: '' },
                        complete: { href: '' },
                        update: { href: '' },
                        move: [],
                    },
                };
                laterTodo2 = {
                    task: 'later thing two', _links: {
                        delete: { href: '' },
                        complete: { href: '' },
                        update: { href: '' },
                        move: [],
                    },
                };
                const todos = [todo1, todo2];
                const laterTodos = [laterTodo1, laterTodo2];
                listWithProps = _.clone(listAndLink);
                listWithProps.list.todos = todos;
                listWithProps.list.deferredTodos = laterTodos;
                tree.setProps({ listAndLink: listWithProps });
                listGroup = tree.find('ListGroup');
            });

            it('contains a Todo for each todo', () => {
                expect(listGroup.find(Todo).length).toBe(4);
            });

            describe('each todo', () => {
                let todo: ShallowWrapper;

                beforeEach(() => {
                    todo = listGroup.find(Todo).at(0);
                });

                it('has an index', () => {
                    expect(todo.prop('index')).toEqual(0);
                });

                describe('move handler', () => {
                    let moveHandler: (link: Link) => void;

                    beforeEach(() => {
                        moveHandler = todo.prop('handleMove');
                    });

                    it('fires move todo action with link for the matching target', () => {
                        const moveLink = { href: 'http://some.api/moveTodo' };
                        moveHandler(moveLink);
                        expect(mockMoveTodoActionFn).toBeCalledWith(moveLink);
                    });
                });

                it('has task and links', () => {
                    expect(todo.prop('task')).toEqual('thing one');
                    expect(todo.prop('links')).toEqual(expect.objectContaining({ delete: deleteLinkOne }));
                });
            });
        });
    });
});
