import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Components from './components.jsx';
const { SectionWrapper, SectionHeader } = Components;

const P = styled.p`
    color: ${props => props.theme.highlight};
`;

class Hardware extends React.Component {
    render() {
        return (
            <SectionWrapper theme={this.props.theme} id="hardware">
                <SectionHeader>Hardware</SectionHeader>
                <P theme={this.props.theme}>
                    Come learn more about MHacks 12 hardware at our hardware
                    table!
                </P>
            </SectionWrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data,
        configurationState: state.configurationState
    };
}

export default connect(mapStateToProps)(Hardware);
