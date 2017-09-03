import React from 'react';
import styled from 'styled-components';

const InputField = styled.div`
    width: 100%;
    margin: 10px 0;
    display: flex;
    flexDirection: column;
    justifyContent: space-between;

    textarea {
        padding: 10px;
        borderColor: rgb(215, 215, 215);
        flexGrow: 1;
        height: 120px;
        borderRadius: 5px;
    }
`;

const LabeledTextarea = props => (
    <InputField>
        <p>{props.label}</p>
        {React.Children.toArray(props.children)}
    </InputField>
);

export default LabeledTextarea;
