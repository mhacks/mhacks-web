import React from 'react';
import styled from 'styled-components';
import { devices } from '../styles';

const InputField = styled.div`
    width: 100%;
    margin: 10px 0;
    display: flex;
    flexDirection: column;
    justifyContent: space-between;
    alignItems: flex-start;

    ${devices.small`
        flexDirection: row;
        alignItems: center;
    `}

    p {
        width: ${props => props.labelWidth};
        marginRight: 30px;
        marginBottom: 4px;
        overflow: hidden;

        ${devices.small`
            marginBottom: 1em;
        `}
    }

    .Select-control {
        border: 1px solid ${props => props.hasError ? 'red' : '#ccc'};
    }
`;

const ChildContainer = styled.div`
    flexGrow: 1;
    width: 100%;
`;

const LabeledInput = props =>
    <InputField
        labelWidth={props.labelWidth || '60%'}
        hasError={props.hasError || false}
    >
        <p>{props.label}{props.required ? '*' : ''}</p>
        <ChildContainer>
            {React.Children.toArray(props.children)}
        </ChildContainer>
    </InputField>;

export default LabeledInput;
