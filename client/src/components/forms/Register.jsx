import React from 'react';
import { Redirect } from 'react-router-dom';
import Input from '../common/Input';
import withForm from '../hocs/WithForm';
import withError from '../hocs/WithError';
import userRegisterModel from '../../helpers/models/userRegisterModel'
import { UserConsumer } from '../contexts/UserContext';

const RegisterBase = (props) => {
    const { isLoggedIn } = props;
    if (isLoggedIn) {
        return (
            <Redirect to="/" />
        );
    }
    return (
        <div className="container">
            <h1>Register</h1>
            <form onSubmit={props.handleFormSubmit}>
                <Input
                    inputType={true}
                    name="username"
                    value={props.username}
                    onChange={props.handleChange}
                    label="Username"
                />
                <Input
                    inputType={true}
                    name="email"
                    value={props.email}
                    onChange={props.handleChange}
                    label="E-mail"
                />
                <Input
                    inputType={true}
                    name="password"
                    type="password"
                    value={props.password}
                    onChange={props.handleChange}
                    label="Password"
                />
                <Input
                    inputType={true}
                    name="repeat"
                    type="password"
                    value={props.repeat}
                    onChange={props.handleChange}
                    label="Repeat password"
                />
                <br/>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
        </div>
    );
}

const WithFormRegister = withForm(RegisterBase, userRegisterModel);

const RegisterWithContext = (props) => {
    return (
        <UserConsumer>
            {
                (user) => (
                    <WithFormRegister
                        {...props}
                        isLoggedIn={user.isLoggedIn}
                    />
                )
            }
        </UserConsumer>
    )
}

export default withError(RegisterWithContext);