import {TaskForm} from '../TaskForm';
import React from 'react';
import {mount} from 'enzyme';
import _ from 'lodash';

describe('TaskForm', () => {
    let tree,
    input,
    createLink,
    createdDeferredLink,
    links,
    mockCreateTodoActionFn,
    mockTaskChangeHandlerFn,
    mockSubmittingChangeHandlerFn;

    beforeEach(() => {
        mockCreateTodoActionFn = jest.fn();
        mockTaskChangeHandlerFn = jest.fn();
        mockSubmittingChangeHandlerFn = jest.fn();
        createLink = {href: 'http://some.api/create'};
        createdDeferredLink = {href: 'http://some.api/createDeferred'};
        links = {
            create: createLink,
            createDeferred: createdDeferredLink
        };
        tree = mount(<TaskForm task=''
                               primaryButtonName='primary'
                               secondaryButtonName='secondary'
                               submitting={false}
                               links={links}
                               handleTaskChange={mockTaskChangeHandlerFn}
                               handleSubmitChange={mockSubmittingChangeHandlerFn}
                               createTodoRequestAction={mockCreateTodoActionFn} />);
        input = tree.node.taskInput;
    });

    it('renders', () => {
        expect(tree.length).toEqual(1);
    });

    describe('upon receiving props', () => {
        it('sets input value to received task when task is empty', () => {
            input.value = 'some value'
            tree.setProps({task: ''});
            expect(input.value).toEqual('');
        });

        it('does not set input value to received task when task is not empty', () => {
            input.value = 'some task'
            tree.setProps({task: 'some other task'});
            expect(input.value).toEqual('some task');
        });
    });

    describe('text input', () => {
        let formControl;

        beforeEach(() => {
            formControl = tree.find('FormControl');
        });

        it('renders', () => {
            expect(formControl.length).toBe(1);
        });

        it('has no value by default', () => {
            expect(input.value).toEqual('');
        });

        it('calls task change handler on change', () => {
            formControl.simulate('change', {target: {value: 'things'}});
            expect(mockTaskChangeHandlerFn).toBeCalledWith('things');
        });

        describe('when todo has a task', () => {
            beforeEach(() => {
                tree.setProps({task: 'some task'});
            });

            it('calls submitting change handler with true on pressing the "submit" hotkey', () => {
                tree.find('HotKeys').at(1).props().handlers.submit();
                expect(mockSubmittingChangeHandlerFn).toBeCalledWith(true);
            });

            describe('when submitting props is true', () => {
                beforeEach(() => {
                    tree.setProps({submitting: true});
                    formControl = tree.find('FormControl');
                });

                it('does not toggle the submitting state to false on pressing the "submit" hotkey', () => {
                    tree.find('HotKeys').at(1).props().handlers.submit();
                    expect(mockSubmittingChangeHandlerFn).not.toBeCalled();
                });

                it('calls submitting change handler with false on pressing the "cancel" hotkey', () => {
                    tree.find('HotKeys').at(0).props().handlers.cancel();
                    expect(mockSubmittingChangeHandlerFn).toBeCalledWith(false);
                });
            });
        });
    });

    describe('buttons', () => {
        let buttons;

        beforeEach(() => {
            buttons = tree.find('Button');
        });

        it('renders 1 by default', () => {
            expect(buttons.length).toBe(1);
        });


        describe('default button', () => {
            it('is disabled by default', () => {
                let button = buttons.at(0);
                expect(button.prop('disabled')).toBe(true);
            });

            it('is disabled when the todo has a task consisting entirely of whitespace', () => {
                tree.setProps({task: '  '});
                let button = tree.find('Button').at(0);
                expect(button.prop('disabled')).toBe(true);
            });

            it('is enabled when the todo has a task', () => {
                tree.setProps({task: 'hey'});
                let button = tree.find('Button').at(0);
                expect(button.prop('disabled')).toBe(false);
            });

            it('calls submitting change handler with true on click', () => {
                tree.setProps({task: 'hey'});
                let button = tree.find('Button').at(0);
                button.simulate('click');
                expect(mockSubmittingChangeHandlerFn).toBeCalledWith(true);
            });
        });

        describe('when submitting', () => {
            beforeEach(() => {
                tree.setProps({task: 'something', submitting: true});
                input.value = 'something';
                buttons = tree.find('Button');
            });

            it('renders 3 buttons when all links are present', () => {
                expect(buttons.length).toBe(3);
            });

            it('renders 2 buttons when create link is missing', () => {
                let linksWithoutCreateLink = _.clone(links);
                delete linksWithoutCreateLink.create
                tree.setProps({links: linksWithoutCreateLink})
                buttons = tree.find('Button');
                expect(buttons.length).toBe(2);
            });

            describe('first button', () => {
                let button;

                beforeEach(() => {
                    button = buttons.at(0);
                });

                it('has title matching primary button name', () => {
                    expect(button.text()).toEqual('Primary');
                });

                describe('on click', () => {
                    beforeEach(() => {
                        button.simulate('click');
                    });

                    it('fires create todo action with create link', () => {
                        expect(mockCreateTodoActionFn).toBeCalledWith(createLink, {task: 'something'});
                    });

                    it('calls submitting change handler with false', () => {
                        expect(mockSubmittingChangeHandlerFn).toBeCalledWith(false);
                    });

                    it('calls task change handler with cleared out task', () => {
                        expect(mockTaskChangeHandlerFn).toBeCalledWith('');
                    });

                    it('clears the todo input value', () => {
                        expect(input.value).toEqual('');
                    });

                    it('puts focus on the input', () => {
                        // TODO: Cannot get this test to fail
                        expect(document.activeElement).toEqual(input);
                    });
                });
            });

            describe('second button', () => {
                let button;

                beforeEach(() => {
                    button = buttons.at(1);
                });

                it('has title matching secondary button name', () => {
                    expect(button.text()).toEqual('Secondary');
                });

                describe('on click', () => {
                    beforeEach(() => {
                        button.simulate('click');
                    });

                    it('fires create todo action with todoLaterLink', () => {
                        expect(mockCreateTodoActionFn).toBeCalledWith(createdDeferredLink, {task: 'something'});
                    });

                    it('calls submitting change handler with false', () => {
                        expect(mockSubmittingChangeHandlerFn).toBeCalledWith(false);
                    });

                    it('calls task change handler with cleared out task', () => {
                        expect(mockTaskChangeHandlerFn).toBeCalledWith('');
                    });

                    it('clears the todo input value', () => {
                        expect(input.value).toEqual('');
                    });

                    it('puts focus on the input', () => {
                        // TODO: Cannot get this test to fail
                        expect(document.activeElement).toEqual(input);
                    });
                });
            });

            describe('on clicking third button', () => {
                beforeEach(() => {
                    buttons.at(2).simulate('click');
                });

                it('calls submitting change handler with false', () => {
                    expect(mockSubmittingChangeHandlerFn).toBeCalledWith(false);
                });

                it('puts focus on the input', () => {
                    expect(document.activeElement).toEqual(input);
                });
            });
        });
    });
});
