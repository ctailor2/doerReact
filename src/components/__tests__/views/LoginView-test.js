jest.unmock('../../views/LoginView');

import {LoginView} from '../../views/LoginView';
import {shallow} from 'enzyme';
import React from 'react';
import Header from '../../Header';
import {browserHistory} from 'react-router';

describe('LoginView', () => {
    let tree, loginRequestActionFn;

    beforeEach(() => {
        loginRequestActionFn = jest.fn();
        tree = shallow(<LoginView loginRequestAction={loginRequestActionFn}/>);
    });

    it('renders', () => {
        expect(tree.length).toBe(1);
    });

    it('has a Header', () => {
        expect(tree.find(Header).length).toBe(1);
    });

    it('has default state', () => {
        expect(tree.state()).toEqual({
            email: '',
            password: ''
        });
    });

    describe('leading link', () => {
        let leadingLink

        beforeEach(() => {
            leadingLink = tree.find('.leading-link');
        });

        it('renders', () => {
            expect(leadingLink.length).toBe(1);
        });

        it('leads with a question', () => {
            expect(leadingLink.text()).toContain('Not registered yet?');
        });

        describe('link', () => {
            let link;

            beforeEach(() => {
                browserHistory.push = jest.fn();
                link = leadingLink.find('a');
            });

            it('renders', () => {
                expect(link.length).toBe(1);
            });

            it('links to sign up', () => {
                expect(link.text()).toBe('Sign up');
            });

            it('redirects to the login page on click', () => {
                link.simulate('click');
                expect(browserHistory.push).toBeCalledWith('/signup');
            });
        });
    });

    describe('form', () => {
        let form;

        beforeEach(() => {
            form = tree.find('form');
        });

        it('renders', () => {
            expect(form.length).toBe(1);
        });

        describe('email form group', () => {
            let formGroup;

            beforeEach(() => {
                formGroup = form.find('FormGroup').at(0);
            });

            it('renders', () => {
                expect(formGroup.length).toBe(1);
            });

            it('has id', () => {
                expect(formGroup.prop('controlId')).toBe('email');
            });

            it('has an Email label', () => {
                let label = formGroup.find('ControlLabel');
                expect(label.length).toBe(1);
                expect(label.childAt(0).text()).toBe('Email');
            });

            describe('text input', () => {
                let input;

                beforeEach(() => {
                    input = formGroup.find('FormControl');
                });

                it('renders', () => {
                    expect(input.length).toBe(1);
                    expect(input.prop('type')).toBe('text');
                });

                it('has no value by default', () => {
                    expect(input.prop('value')).toBeUndefined();
                });

                it('updates state on change', () => {
                    input.simulate('change', {target: {value: 'test@email.com'}});
                    expect(tree.state().email).toBe('test@email.com');
                });
            });
        });

        describe('password form group', () => {
            let formGroup;

            beforeEach(() => {
                formGroup = form.find('FormGroup').at(1);
            });

            it('renders', () => {
                expect(formGroup.length).toBe(1);
            });

            it('has id', () => {
                expect(formGroup.prop('controlId')).toBe('password');
            });

            it('has a Password label', () => {
                let label = formGroup.find('ControlLabel');
                expect(label.length).toBe(1);
                expect(label.childAt(0).text()).toBe('Password');
            });

            describe('password input', () => {
                let input;

                beforeEach(() => {
                    input = formGroup.find('FormControl');
                });

                it('has a password input', () => {
                    expect(input.length).toBe(1);
                    expect(input.prop('type')).toBe('password');
                });

                it('updates state on change', () => {
                    input.simulate('change', {target: {value: 'password'}});
                    expect(tree.state().password).toBe('password');
                });
            });
        });

        describe('submit button', () => {
            let button;

            beforeEach(() => {
                button = form.find('Button');
            });

            it('renders', () => {
                expect(button.length).toBe(1);
                expect(button.childAt(0).text()).toBe('Submit');
                expect(button.prop('type')).toBe('button');
                expect(button.prop('bsStyle')).toBe('primary');
            });

            it('is disabled by default', () => {
                expect(button.prop('disabled')).toBe(true);
            });

            it('enables when all fields are entered', () => {
                tree.setState({email:'email', password:'password'});
                button = tree.find('Button');
                expect(button.prop('disabled')).toBe(false);
            });

            it('fires login request action with form data on click', () => {
                let formData = {
                    email: 'test@email.com',
                    password: 'password'
                }
                tree.setState(formData);
                button.simulate('click');
                expect(loginRequestActionFn).toBeCalledWith(formData);
            });
        });
    });
});