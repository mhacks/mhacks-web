import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components';
import { SectionHeader, SectionBody } from './section_components.jsx';
import theme from '../../styles/theme.js';

const Wrapper = styled.div`
    backgroundColor: ${props => props.theme.secondary};
    padding: 80px 0;
`;

const PlaceHolderImage = styled.div`
    height: 200px;
    width: 200px;
    padding: 50px;
    margin: 50px;
    borderStyle: solid;
    borderColor: ${theme.highlight};
`;

const FlexBox = styled.div`
    display: flex;
    flexWrap: wrap;
    justifyContent: center;
`;

class Sponsorship extends React.Component {
	render() {
		return (
			<Wrapper>
                <Container>
                    <SectionHeader>Sponsorship</SectionHeader>
                    <SectionBody> MHacks is the gateway between you and the top tech talent in the world. Whether you come to network, promote brand awareness, or get feedback on a product or API, we’ll provide the tools you need to make the most out of your experience. </SectionBody>
                    <SectionBody> Interested in sponsoring? Want more information? Our next major event will be in the Fall and we'd love to hear from you! Shoot us an email at kevin@mhacks.org. </SectionBody>
                    <SectionBody> We have an awesome lineup of sponsors for you! Check back soon for logos. </SectionBody>
                    <FlexBox>
                        <PlaceHolderImage />
                        <PlaceHolderImage />
                        <PlaceHolderImage />
                    </FlexBox>
                </Container>

			</Wrapper>
		);
	}
}

export default Sponsorship;
