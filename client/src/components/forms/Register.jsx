import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import validator from 'validator';

import { notify } from '../../helpers/notify';
import Input from '../common/Input';
import AuthService from '../../services/auth';

function validateForm(payload) {
	let errors = {};
	let isFormValid = true;
    let message = '';
    
    if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
		isFormValid = false;
		errors.name = 'Please provide your username.';
	}

	if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
		isFormValid = false;
		errors.email = 'Please provide a correct email address.';
	}

	if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 3) {
		isFormValid = false;
		errors.password = 'Password must have at least 3 characters.';
	}

	if (!(payload.password === '' && payload.repeat === '') && !(payload.password === payload.repeat)) {
		isFormValid = false;
		errors.passwordsDontMatch = 'Passwords do not match!';
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

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            repeat: '',
            error: []
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
        const { username, email, password } = this.state;
        const credentials = { username, email, password };

        let validationResult = validateForm(this.state);

        if (!validationResult.success) {
            notify('error', validationResult.message, validationResult.errors);
            return;
        }
        
        const res = await Register.service.postRegister(credentials);

        if (!res.success) {
            this.setState({ error: res.errors });
            notify('error', this.state.error);
            return;
        } else {
            notify('success', res.message);
        }

        this.props.history.push('/');
    }

    render() {
        return (
            <div className="container">
                <h1>Register</h1>
                <form onSubmit={this.onSubmitHandler}>
                    <Input
                        name="username"
                        value={this.state.username}
                        onChange={this.onChangeHandler}
                        label="Username"
                    />
                    <Input
                        name="email"
                        value={this.state.email}
                        onChange={this.onChangeHandler}
                        label="E-mail"
                    />
                    <Input
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.onChangeHandler}
                        label="Password"
                    />
                    <Input
                        name="repeat"
                        type="password"
                        value={this.state.repeat}
                        onChange={this.onChangeHandler}
                        label="Repeat password"
                    />
                    <br/>
                    <input type="submit" className="btn btn-primary" value="Register" />
                </form>
            </div>
        );
    }
}

export default withRouter(Register);