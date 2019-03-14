import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import notify from '../../helpers/data/notifier';

class AdminRoute extends Component {
    render() {
        if (localStorage.getItem('isAdmin') !== 'true') {
            notify('error', 'You have to be admin to have access.');
            return <Redirect to="/user/login" />;
        };

        return (
            <Route {...this.props}/>
        );
    }
}

export default AdminRoute;