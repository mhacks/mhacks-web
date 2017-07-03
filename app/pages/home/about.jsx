import React from 'react';
import styled from 'styled-components';
import { SectionHeader, SectionBody } from './section_components.jsx';
import { Container } from '../../components';

const Wrapper = styled.div`
    backgroundColor: ${props => props.theme.secondary}
    padding: 80px 0;
`;

class About extends React.Component {
    render() {
        return (
            <Wrapper>
                <Container>
                    <SectionHeader>About MHacks</SectionHeader>
                    <SectionBody>MHacks is a 36-hour hackathon run by University of Michigan students. At MHacks, we want to help you to turn your ideas into reality. We’ll give you the freedom, resources, and mentoring you need to do so and in return we hope you’ll be as curious, productive, and passionate as you can be. For newcomers and veterans alike, MHacks is a weekend experience you won’t want to miss.</SectionBody>
                </Container>
            </Wrapper>
        );
    }
}

export default About;
