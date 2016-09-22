import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Navbar, Brand, Nav, NavDropdown, MenuItem} from 'react-bootstrap';
import {logoutRequestAction} from '../actions/sessionActions';

export class Header extends Component {
    constructor(props) {
        super(props);

        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    render() {
        return(
            <div>
                <Navbar>
                    <Navbar.Brand>Doer</Navbar.Brand>
                    {this.renderNav()}
                </Navbar>
            </div>
        );
    }

    renderNav() {
        if(localStorage.getItem('sessionToken')) {
            return(
                <Nav pullRight>
                    <NavDropdown title='Menu' id='header-menu-dropdown'>
                        <MenuItem onClick={this.handleLogoutClick}>Logout</MenuItem>
                    </NavDropdown>
                </Nav>
            );
        }
    }

    handleLogoutClick() {
        this.props.logoutRequestAction();
    }
}

export default connect(null, {logoutRequestAction})(Header);