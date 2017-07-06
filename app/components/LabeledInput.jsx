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

    select {
        background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNC45NSIgaGVpZ2h0PSIxMCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxLjQxIDQuNjcgMi40OCAzLjE4IDMuNTQgNC42NyAxLjQxIDQuNjciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMy41NCA1LjMzIDIuNDggNi44MiAxLjQxIDUuMzMgMy41NCA1LjMzIi8+PC9zdmc+) no-repeat 95% 50%;
        paddingLeft: 10px;
        appearance: none;
        borderColor: rgb(215, 215, 215);
        flexGrow: 1;
        height: 44px;
    }

    input {
        flexGrow: 1;
        paddingLeft: 10px;
        height: 44px;
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
