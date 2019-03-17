import React from 'react';
import { Redirect } from 'react-router-dom';
import Input from '../common/Input';
import withForm from '../hocs/WithForm';
import withError from '../hocs/WithError';
import userLoginModel from '../../helpers/models/userLoginModel';
import { UserConsumer } from '../contexts/UserContext';

const LoginBase = (props) => {
    const { isLoggedIn } = props;
    if (isLoggedIn) {
        return (
            <Redirect to="/" />
        );
    }
    return (
        <div className="container">
            <h1>Login</h1>
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
                    name="password"
                    type="password"
                    value={props.password}
                    onChange={props.handleChange}
                    label="Password"
                />
                <br/>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
        </div>
    );
}

const WithFormLogin = withForm(LoginBase, userLoginModel);

const LoginWithContext = (props) => {
    return (
        <UserConsumer>
            {
                (user) => (
                    <WithFormLogin
                        {...props}
                        isLoggedIn={user.isLoggedIn}
                    />
                )
            }
        </UserConsumer>
    )
}

export default withError(LoginWithContext);