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

class Resources extends React.Component {
    render() {
        return (
            <SectionWrapper theme={this.props.theme} id="resources">
                <SectionHeader>Resources</SectionHeader>
                <P theme={this.props.theme}>
                    <A href="#">iOS Tutorials</A> <br />{' '}
                    <A href="#">Android Tutorials</A> <br />{' '}
                    <A href="#">Docker Getting Started</A> <br />
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

export default connect(mapStateToProps)(Resources);
