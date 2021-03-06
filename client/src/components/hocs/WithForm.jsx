import React, { Component } from 'react';

import notify from '../../helpers/data/notifier';
import getRequestData from '../../helpers/data/getRequestData';
import ServerNotResponding from '../views/Issue/SeverNotResponding';

const withForm = (WrappedComponent, model) => {
    return class WithForm extends Component {
        constructor(props) {
            super(props);

            this.state = {
                ...model.defaultState,
                error: {},
                hasServerIssue: false,
            };

            this.handleChange = this.handleChange.bind(this);
            this.handleFormSubmit = this.handleFormSubmit.bind(this);
        }

        handleChange(e) {
            this.setState({
                [e.target.name]: e.target.value
            });
        }

        async handleFormSubmit(e) {
            e.preventDefault();

            const credentials = getRequestData(this.state, model.defaultState);

            let validationResult = this.props.validateForm(credentials);

            if (!validationResult.success) {
                notify('error', validationResult.message, validationResult.errors);
                return;
            } else {
                e.target.reset();
            }

            try {
                const res = await this.props.request(credentials, this.props.postId);

                if (!res) {
                    return;
                }

                if (!res.success) {
                    if (res.errors) {
                        const errors = (res.errors).reduce((obj, key) => {
                            obj[key['param']] = key['msg']
                            return obj;
                        }, {})
                        this.setState({ error: errors });
                        notify('error', 'Invalid input', errors);
                        return;
                    } else {
                        notify('error', res.message);
                        return;
                    }
                } else {
                    if (res.token) {
                        localStorage.setItem('authToken', res.token);
                        localStorage.setItem('userId', res.userId);
                        
                        let user = {
                            isLoggedIn: res.success,
                            isAdmin: res.isAdmin,
                            username: res.username,
                        }
                        
                        localStorage.setItem('user', JSON.stringify(user));
                        this.props.updateUser(user);
                    }

                    if (res.comment) {
                        this.props.updateComms(res);
                    }
                    
                    notify('success', res.message);

                    const curPath = this.props.location.pathname;
                    
                    if (!curPath.includes('details')) {
                        this.props.history.push('/');
                    }
                }
            }
            catch (err) {
                this.setState({ hasServerIssue: true });
                console.log(err);
            }
        }

        render() {
            const { hasServerIssue } = this.state;

            if (hasServerIssue) {
                return <ServerNotResponding />;
            }

            return (
                <WrappedComponent
                    {...this.props}
                    handleChange={this.handleChange}
                    handleFormSubmit={this.handleFormSubmit}
                />
            );
        }
    };
}

export default withForm;