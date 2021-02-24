import * as React from 'react';

export const Button = props => {
    return (
        <button onClick={props.onClick} style={{ color: 'red' }}>
            {props.children}
        </button>
    );
};
