import React, { Fragment } from 'react';

import '../../styles/input.css';

const Input = (props) => {
    const { inputType, name, type = 'text', value, onChange, label, placeholder } = props;
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
                        placeholder={placeholder}
                    />
                ) : (
                    <textarea
                        onChange={onChange}
                        name={name}
                        id={name}
                        type={type}
                        value={value}
                        placeholder={placeholder}
                    />
                )
            }
            <br/>
        </Fragment>
    );
}

export default Input;