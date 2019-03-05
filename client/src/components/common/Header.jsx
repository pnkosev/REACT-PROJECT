import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/navigation.css';

export default class Header extends Component {
    render() {
        const { isLoggedIn, onLogout, username } = this.props;

        return (
            <header>
                <p className="title">Blog System</p>
                {username ? <p className="welcome-msg">Welcome, {username}</p> : null }
                <nav>
                    {
                        isLoggedIn
                            ? (
                                <ul>
                                    <li>
                                        <NavLink exact to="/" activeClassName="active">Home</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/post/create" activeClassName="active">Post</NavLink>
                                    </li>
                                    <li>
                                        <a href="/logout" onClick={onLogout}>Logout</a>
                                    </li>
                                </ul>
                            ) : (
                                <ul>
                                    <li>
                                        <NavLink exact to="/" activeClassName="active">Home</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/user/register" activeClassName="active">Register</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/user/login" activeClassName="active">Login</NavLink>
                                    </li>
                                </ul>
                            )
                    }
                </nav>
            </header>
        );
    }
}