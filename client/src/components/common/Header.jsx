import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { UserConsumer } from '../contexts/UserContext';
import '../../styles/navigation.css';

class Header extends Component {
    render() {
        const { isLoggedIn, onLogout, username, isAdmin } = this.props;

        return (
            <header>
                <p className="title">Blog System</p>
                {username ? <p className="welcome-msg">Welcome, {username}</p> : null }
                <nav>
                    {
                        isLoggedIn
                            ? (
                                <ul>
                                    {
                                        isAdmin
                                        ? (
                                            <li>
                                                <NavLink exact to="/user/admin/work" activeClassName="active">Work-work</NavLink>
                                            </li>
                                        ) : (
                                            null
                                        )
                                    }
                                    <li>
                                        <NavLink exact to="/" activeClassName="active">Home</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/user/profile" activeClassName="active">Profile</NavLink>
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

const HeaderWithUserContext = (props) => {
    return (
        <UserConsumer>
            {
                (user) => (
                    <Header
                        {...props}
                        isLoggedIn={user.isLoggedIn}
                        username={user.username}
                        isAdmin={user.isAdmin}
                    />
                )
            }
        </UserConsumer>
    )
}

export default HeaderWithUserContext;