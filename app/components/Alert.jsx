import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    color: ${props => props.color};
    background-color: ${props => props.backgroundColor};
    textAlign: center;
    borderRadius: 10px;
`;

const Message = styled.p`
    padding: 10px;
    margin: 0;
`;

class Alert extends React.Component {
    render() {
        // default to negative colors
        var backgroundColor = '#ffbaba';
        var color = '01ff70';

        if (this.props.positive) {
            backgroundColor = '#01ff70';
        }

        return (
            <Wrapper backgroundColor={backgroundColor} color={color}>
                <Message>{this.props.message}</Message>
            </Wrapper>
        );
    }
}

export default Alert;
