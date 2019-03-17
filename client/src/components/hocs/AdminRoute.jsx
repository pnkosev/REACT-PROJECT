import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import notify from '../../helpers/data/notifier';
import { UserConsumer } from '../contexts/UserContext';

const AdminRoute = (props) => {
    if (!props.isAdmin) {
        notify('error', 'You have to be admin to have access.');
        return <Redirect to="/user/login" />;
    };

    return (
        <Route {...props}/>
    );
}

const AdminRouteWithUserContext = (props) => {
    return (
        <UserConsumer>
            {
                (user) => (
                    <AdminRoute
                        {...props}
                        isAdmin={user.isAdmin}
                    />
                )
            }
        </UserConsumer>
    )
}

export default AdminRouteWithUserContext;