import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Components from './components.jsx';
const { SectionWrapper, SectionHeader } = Components;

const P = styled.p`color: ${props => props.theme.highlight};`;

const A = styled.a`
    color: white;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

class Hardware extends React.Component {
    render() {
        return (
            <SectionWrapper theme={this.props.theme}>
                <SectionHeader>Hardware</SectionHeader>
                <P theme={this.props.theme}>
                    We have tons of hardware for you to hack on! Check out our
                    hardware list <A href="#">here</A>. Learn more about the
                    MHacks X Hacker Boards <A href="#">here</A>
                </P>
            </SectionWrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Hardware);
