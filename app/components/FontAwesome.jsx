import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    text-align: center;
`;

const Icon = styled.i`
    height: 100%;
    margin: auto;
`;

class FontAwesome extends React.Component {
    render() {
        return (
            <Wrapper style={this.props.style}>
                <Icon
                    className={`${this.props.brand ? 'fab' : 'fas'} fa-${
                        this.props.name
                    } fa-${this.props.size}`}
                    alt={this.props.alt}
                    align="middle"
                />
            </Wrapper>
        );
    }
}

FontAwesome.defaultProps = {
    brand: false,
    style: {},
    name: '',
    size: '1x'
};

export default FontAwesome;
