import React, { Fragment } from 'react';

const Input = (props) => {
    const { inputType, name, type = 'text', value, onChange, label } = props;
    return (
        <Fragment>
            <label htmlFor={name}>{label}</label> <br/>
            {
                inputType
                ? (
                    <input
                        onChange={onChange}
                        name={name}
                        id={name}
                        type={type}
                        value={value} 
                    />
                ) : (
                    <textarea
                        onChange={onChange}
                        name={name}
                        id={name}
                        type={type}
                        value={value} 
                    />
                )
            }
            <br/>
        </Fragment>
    );
}

export default Input;