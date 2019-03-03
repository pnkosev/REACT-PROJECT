import React, { Component, Fragment } from 'react';


export default class Input extends Component {
    render() {
        const { name, type = 'text', value, onChange, label } = this.props;
        return (
            <Fragment>
                <label htmlFor={name}>{label}</label> <br/>
                <input
                    onChange={onChange}
                    name={name}
                    id={name}
                    type={type}
                    value={value} 
                /> <br/>
            </Fragment>
        );
    }
}