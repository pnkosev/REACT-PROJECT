import React, { Component } from 'react';
import Input from '../common/Input';
import { login } from '../../api/remote';
import { withRouter } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            error: '',
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler({ target }) {
        this.setState({ [target.name]: target.value });
    }

    async onSubmitHandler(e) {
        e.preventDefault();
        const { username, password } = this.state;
        
        const res = await login(username, password);

        if (res.error) {
            this.setState({ error: res.error });
            return;
        }
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('isAdmin', res.isAdmin);

        this.props.history.push('/');
    }

    render() {
        const error = this.state.error;
        return (
            <div className="container">
                <h1>Login</h1>
                {
                    error
                    ? <h2 className="errorMessage">{error}</h2>
                    : null
                }
                <form onSubmit={this.onSubmitHandler}>
                    <Input
                        name="username"
                        value={this.state.username}
                        onChange={this.onChangeHandler}
                        label="Username"
                    />
                    <Input
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.onChangeHandler}
                        label="Password"
                    />
                    <br/>
                    <input type="submit" className="btn btn-primary" value="Login" />
                </form>
            </div>
        );
    }
}

export default withRouter(Login);