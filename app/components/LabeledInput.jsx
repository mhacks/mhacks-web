import React from 'react';
import styled from 'styled-components';

const InputField = styled.div`
    width: 100%;
    margin: 10px 0;
    display: flex;
    justifyContent: space-between;

    p {
        width: ${props => props.labelWidth};
    }

    select {
        background: none;
        borderColor: rgb(215, 215, 215);
        marginLeft: 30px;
        flexGrow: 1;
    }

    input {
        marginLeft: 30px;
        paddingLeft: 10px;
        flexGrow: 1;
    }
`;

const LabeledInput = (props) => (
    <InputField
        labelWidth={props.labelWidth || '100px'}
    >
        <p>{props.label}</p>
        {React.Children.toArray(props.children)}
    </InputField>
);

export default LabeledInput;
