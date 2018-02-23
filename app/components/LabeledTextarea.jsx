import React from 'react';
import styled from 'styled-components';

const InputField = styled.div`
    width: 100%;
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    textarea {
        padding: 10px;
        border-color: rgb(215, 215, 215);
        flex-grow: 1;
        height: 120px;
        border-radius: 5px;
    }
`;

const LabeledTextarea = props => (
    <InputField>
        <p>{props.label}</p>
        {React.Children.toArray(props.children)}
    </InputField>
);

export default LabeledTextarea;
