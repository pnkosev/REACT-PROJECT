import React, { Component } from 'react';
import Input from '../common/Input';
import { register } from '../../api/remote';
import { withRouter } from 'react-router-dom';

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

    onChangeHandler({ target }) {
        this.setState({ [target.name]: target.value });
    }

    async onSubmitHandler(e) {
        e.preventDefault();
        
        const res = await register(this.state.username, this.state.email, this.state.password);

        if (res.errors) {
            this.setState({ error: res.errors });
            return;
        }

        if (this.state.password !== this.state.repeat) {
            this.setState({
                error: [{
                    msg: "Passwords don't match"
                }]
            });
            return;
        }

        this.props.history.push('/user/login');
    }

    render() {
        let errors = null;
        if (this.state.error) {
            errors = (
                <div>
                    {Object.keys(this.state.error).map(k => {
                        return <h2 key={k} className="errorMessage">{this.state.error[k].msg}</h2>;
                    })}
                </div>
            );
        }

        return (
            <div className="container">
                <h1>Register</h1>
                {errors}
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