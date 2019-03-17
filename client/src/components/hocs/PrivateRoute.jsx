import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import notify from '../../helpers/data/notifier';
import { UserConsumer } from '../contexts/UserContext';

const PrivateRoute = (props) => {
    if (!props.isLoggedIn) {
        notify('error', 'You have to be logged in to be able to proceed.');
        return <Redirect to="/user/login" />;
    };

    return (
        <Route {...props} />
    );
}

const PrivateRouteWithUserContext = (props) => {
    return (
        <UserConsumer>
            {
                ({isLoggedIn}) => (
                    <PrivateRoute
                        {...props}
                        isLoggedIn={isLoggedIn}
                    />
                )
            }
        </UserConsumer>
    )
}

export default PrivateRouteWithUserContext;