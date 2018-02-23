import React from 'react';
import styled from 'styled-components';
import { devices } from '../styles';

const InputField = styled.div`
    width: 100%;
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 1em;

    ${devices.small`
        flex-direction: row;
        align-items: center;
    `} p {
        width: ${props => props.labelWidth};
        margin-right: 30px;
        margin-bottom: 4px;
        overflow: hidden;

        ${devices.small`
            margin-bottom: 1em;
        `};
    }

    .Select-control {
        border: 1px solid ${props => (props.hasError ? 'red' : '#ccc')};
    }
`;

const P = styled.p`
    color: ${props => (props.theme ? props.theme.textColor : 'black')};
`;

const ChildContainer = styled.div`
    flex-grow: 1;
    width: 100%;
`;

const LabeledInput = props => (
    <InputField
        labelWidth={props.labelWidth || '60%'}
        hasError={props.hasError}
    >
        <P theme={props.theme}>
            {props.label}
            {props.required ? '*' : ''}
        </P>
        <ChildContainer>
            {React.Children.toArray(props.children)}
        </ChildContainer>
    </InputField>
);

export default LabeledInput;
