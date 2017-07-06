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

const Quote = styled.div`
    margin: 20px auto;
    display: ;
    justifyContent: center;
`;

const QuoteText = styled.div`
    color: ${theme.highlight};
    fontSize: 20px;
`;

const CompanyName = styled.div`
    color: ${theme.highlight};
    fontWeight: bold;
    fontSize: 25px;
`;

const Link = styled.a`
    color: white;
`;

class Sponsorship extends React.Component {
	render() {
		return (
			<Wrapper>
                <Container>
                    <SectionHeader>Sponsorship</SectionHeader>
                    <SectionBody> MHacks is the gateway between you and the top tech talent in the world. Whether you come to network, promote brand awareness, or get feedback on a product or API, we’ll provide the tools you need to make the most out of your experience. </SectionBody>
                    <SectionBody> Interested in sponsoring? Want more information? Our next major event will be in the Fall and we'd love to hear from you! Shoot us an email at <Link href="mailto:kevin@mhacks.org">kevin@mhacks.org</Link> </SectionBody>

                    <SectionBody> We have an awesome lineup of sponsors for you. Check back soon for company logos. </SectionBody>

                    <FlexBox>
                        <PlaceHolderImage />
                        <PlaceHolderImage />
                        <PlaceHolderImage />
                    </FlexBox>

                    <Quote>
                        <QuoteText> “This was one of the most well organized student-run hackathons that we’ve ever sponsored.” </QuoteText>
                        <CompanyName> -Google</CompanyName>
                    </Quote>

                    <Quote>
                        <QuoteText> “The caliber and number of students that MHacks attracts is like no other hacking event.” </QuoteText>
                        <CompanyName> -Walmart</CompanyName>
                    </Quote>
                </Container>

			</Wrapper>
		);
	}
}

export default Sponsorship;
