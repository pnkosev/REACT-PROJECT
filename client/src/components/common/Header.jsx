import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Header extends Component {
    render() {
        const { loggedIn, onLogout } = this.props;

        return (
            <header>
                <span>Blog System</span>
                <NavLink exact to="/" activeClassName="active">Home</NavLink>
                {/* {loggedIn && <NavLink to="/create" activeClassName="active">Create Hotel</NavLink>} */}
                {/* {loggedIn && <a href="javascript:void(0)" onClick={onLogout}>Logout</a>} */}
                {!loggedIn && <NavLink to="/user/register" activeClassName="active">Register</NavLink>}
                {!loggedIn && <NavLink to="/user/login" activeClassName="active">Login</NavLink>}
            </header>
        );
    }
}