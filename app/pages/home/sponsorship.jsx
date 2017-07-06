import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components';
import { SectionHeader, SectionBody } from './section_components.jsx';

const Wrapper = styled.div`
    backgroundColor: ${props => props.theme.secondary}
    padding: 80px 0;
`;

class Sponsorship extends React.Component {
	render() {
		return (
			<Wrapper>
                <Container>
                    <SectionHeader>Sponsorship</SectionHeader>
                    <SectionBody> MHacks is the gateway between you and the top tech talent in the world. Whether you come to network, promote brand awareness, or get feedback on a product or API, we’ll provide the tools you need to make the most out of your experience. </SectionBody>
                    <SectionBody> Interested in sponsoring? Want more information? Our next major event will be in the Fall and we'd love to hear from you! Shoot us an email at kevin@mhacks.org. </SectionBody>
                </Container>
			</Wrapper>
		);
	}
}

export default Sponsorship;
