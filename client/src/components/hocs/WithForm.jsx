import React, { Component } from 'react';

import notify from '../../helpers/notifier';

const withForm = (WrappedComponent) =>
    class WithForm extends Component {
        constructor(props) {
            super(props);

            this.state = {
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
            
            const res = await this.props.postRequest(credentials);
    
            if (!res.success) {
                this.setState({ error: res.message });
                notify('error', this.state.error);
                return;
            } else {
                if(res.token) {
                    localStorage.setItem('authToken', res.token);
                }
                if(res.username) {
                    localStorage.setItem('username', res.username);
                }
                if(res.userId) {
                    localStorage.setItem('userId', res.userId);
                }
                if(res.isAdmin) {
                    localStorage.setItem('isAdmin', res.isAdmin);
                }
    
                notify('success', res.message);

                this.props.history.push('/');
            }
        }

        componentDidMount() {
            const isLoggedIn = localStorage.getItem('authToken') !== false;

            if (isLoggedIn) {
                this.props.history.push('/');
            }
        }

        render() {
            return (
                <WrappedComponent
                    handleChange={this.handleChange}
                    handleFormSubmit={this.handleFormSubmit}
                    error={this.state.error}
                />
            );
        }
    };

export default withForm;