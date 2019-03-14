import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import notify from '../../helpers/data/notifier';

class PrivateRoute extends Component {
    render() {
        if (localStorage.getItem('authToken') === null) {
            notify('error', 'You have to be logged in to be able to proceed.');
            return <Redirect to="/user/login" />;
        };

        return (
            <Route {...this.props} />
        );
    }
}

export default PrivateRoute;