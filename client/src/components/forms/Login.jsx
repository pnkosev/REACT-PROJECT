import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { notify } from '../../helpers/notify';

import Input from '../common/Input';
import AuthService from '../../services/auth';

function validateForm(payload) {
	let errors = {};
	let isFormValid = true;
	let message = '';

	if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
		isFormValid = false;
		errors.password = 'Please provide your password.';
	}

	if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
		isFormValid = false;
		errors.name = 'Please provide your name.';
	}

	if (!isFormValid) {
		message = 'Form Validation Failed!';
	}

	return {
		success: isFormValid,
		message: message,
		errors: errors
	};
}

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

    static service = new AuthService();

    onChangeHandler({ target }) {
        this.setState({ [target.name]: target.value });
    }

    async onSubmitHandler(e) {
        e.preventDefault();
        const { username, password } = this.state;

        let validationResult = validateForm(this.state);

        if (!validationResult.success) {
            notify('error', validationResult.message, validationResult.errors);
            return;
        }
        
        const res = await Login.service.postLogin({username, password});

        if (!res.success) {
            this.setState({ error: res.message });
            notify('error', this.state.error);
            return;
        } else {
            localStorage.setItem('authToken', res.token);
            localStorage.setItem('username', res.username);
            localStorage.setItem('userId', res.userId);
            localStorage.setItem('isAdmin', res.isAdmin);
            notify('success', res.message);
            this.props.history.push('/');
        }
        
    }

    render() {
        return (
            <div className="container">
                <h1>Login</h1>
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