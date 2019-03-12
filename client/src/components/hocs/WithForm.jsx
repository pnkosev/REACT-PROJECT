import React, { Component } from 'react';

import notify from '../../helpers/notifier';

const withForm = (WrappedComponent, model) =>
    class WithForm extends Component {
        constructor(props) {
            super(props);

            this.state = {
                ...model.defaultState,
                error: {}
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

            const credentials = Object.keys(this.state).reduce((object, key) => {
                if (key !== 'error') {
                    object[key] = this.state[key]
                }
                return object;
            }, {});

            let validationResult = this.props.validateForm(credentials);

            if (!validationResult.success) {
                notify('error', validationResult.message, validationResult.errors);
                return;
            }

            try {
                const res = await this.props.request(credentials);

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
                        localStorage.setItem('username', res.username);
                        localStorage.setItem('userId', res.userId);
                        localStorage.setItem('isAdmin', res.isAdmin);
                    }
                    notify('success', res.message);
                    this.props.history.push('/');
                }
            }
            catch (err) {
                this.setState({ hasServerIssue: true });
                console.log(err);
            }
        }

        render() {
            return (
                <WrappedComponent
                    handleChange={this.handleChange}
                    handleFormSubmit={this.handleFormSubmit}
                />
            );
        }
    };

export default withForm;