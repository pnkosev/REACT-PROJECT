import React, { Component } from 'react';

function withError(WrappedComponent) {
    return class WithError extends Component {
        constructor(props) {
            super(props);
            this.state = {
                error: null,
                errorInfo: null,
            };
        }

        componentDidCatch(error, errorInfo) {
            // Catch errors in any components below and re-render with error message
            this.setState({
                error: error,
                errorInfo: errorInfo
            })
            // You can also log error messages to an error reporting service here
        }

        render() {
            if (this.state.errorInfo) {
                return (
                    <div>
                        <h2>Something went wrong.</h2>
                        <p>Please excuse us, we are working onto solving the problem!</p>
                    </div>
                );
            }
            return <WrappedComponent {...this.props} />;
        }
    }
}

export default withError;