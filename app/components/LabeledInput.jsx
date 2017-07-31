import React from 'react';
import styled from 'styled-components';
import { devices } from '../styles';

const InputField = styled.div`
    width: 100%;
    margin: 10px 0;
    display: flex;
    flexDirection: column;
    justifyContent: space-between;
    alignItems: center;

    ${devices.small`
        flexDirection: row;
    `}

    p {
        width: ${props => props.labelWidth};
        marginRight: 30px;
        marginBottom: 4px;

        ${devices.small`
            marginBottom: 1em;
        `}
    }
`;

const ChildContainer = styled.div`
    flexGrow: 1;
`;

const LabeledInput = props =>
    <InputField labelWidth={props.labelWidth || '100px'}>
        <p>{props.label}{props.required ? '*' : ''}</p>
        <ChildContainer>{React.Children.toArray(props.children)}</ChildContainer>
    </InputField>;

export default LabeledInput;
