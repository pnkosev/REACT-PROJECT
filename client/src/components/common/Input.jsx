import React, { Fragment } from 'react';

import '../../styles/input.css';

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
                        placeholder="Remember, be nice!"
                    />
                )
            }
            <br/>
        </Fragment>
    );
}

export default Input;