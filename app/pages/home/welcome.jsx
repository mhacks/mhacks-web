import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SectionHeader, SectionBody } from './section_components.jsx';
import { Container } from '../../components';

const Wrapper = styled.div`
    backgroundColor: ${props => props.theme.primary}
    padding: 80px 0;
`;

class Welcome extends React.Component {
    render() {
        return (
            <Wrapper>
                <Container>
                    <SectionHeader>Welcome <br />to MHacks X</SectionHeader>
                    <SectionBody>
                        During MHacks X, we're taking a look back at where MHacks began and how it's evolved. MHacks was founded in Winter 2013 with the core principles that we still aim to achieve today. At MHacks, we want to empower you to achieve your goals and with each passing event we strive to find new ways to do so.
                        <br />
                        <br />
                        At MHacks X you can expect much greater emphasis on you, the hackers, as we reflect on past MHacks events to pinpoint exactly what made it special. We'll be incorporating the most successful features of each event to provide you with the holistically best experience you've had at an MHacks yet.
                    </SectionBody>
                </Container>
            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Welcome);
