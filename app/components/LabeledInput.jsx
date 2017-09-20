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
    fontSize: 1em;

    ${devices.small`
        flexDirection: row;
        alignItems: center;
    `} p {
        width: ${props => props.labelWidth};
        marginRight: 30px;
        marginBottom: 4px;
        overflow: hidden;

        ${devices.small`
            marginBottom: 1em;
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
    flexGrow: 1;
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
