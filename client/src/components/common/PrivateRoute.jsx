import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';

class PrivateRoute extends Component {
    render() {
        if (localStorage.getItem('authToken') === null) {
            return <Redirect to="/user/login" />;
        };

        return (
            <Route {...this.props} />
        );
    }
}

export default PrivateRoute;