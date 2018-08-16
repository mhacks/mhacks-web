import React from 'react';
import styled from 'styled-components';
import { devices } from '../../styles';
import { SectionHeader } from './section_components.jsx';

import { SponsorLogos } from '../../components';
import theme from '../../styles/theme.js';

import GoogleLogo from '../../../static/logos/google.svg';
import WalmartLogo from '../../../static/logos/walmart.svg';

const Wrapper = styled.div`
    background-color: white;
    margin: 0 20px;
`;

const SectionBody = styled.p`
    color: ${theme.secondary};
    font-size: 16px;
    max-width: 600px;
`;

const FlexBox = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 640px;
`;

const FlexBox2 = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 640px;
`;

const QuoteWrapper = styled.div`
    margin: 20px;
    justify-content: center;
    padding: 0;
    box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
    padding: 20px;
    border-radius: 5px;
    width: 100%;
`;

const QuoteText = styled.div`
    color: ${theme.highlight};
    font-size: ${theme.fontSize};
    text-align: left;
`;

const CompanyName = styled.div`
    color: ${theme.highlight};
    font-size: ${theme.fontSize};
    text-align: right;
`;

const CompanyLogo = styled.img`
    height: 40px;
`;

const Link = styled.a`
    color: ${theme.secondary};
`;

const SponsorshipContainer = styled.div`
    padding: 20px 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    overflow: visible;
    margin: 0px 60px;

    ${devices.tablet`
        padding: 75px 0;
        flex-direction: row;
        align-items: center;
    `};
`;

const Container = styled.div`
    width: calc(100% - 60px);
    max-width: 1200px;
    margin: 0 auto;

    ${devices.tablet`
        width: calc(100% - 100px);
    `} ${devices.desktop`
        width: calc(100% - 140px);
    `} ${devices.giant`
        width: calc(100% - 160px);
    `};
`;

const LeftSectionHeader = styled(SectionHeader)`
    text-align: left;
`;

class Sponsorship extends React.Component {
    render() {
        return (
            <Wrapper>
                <Container>
                    <SponsorshipContainer>
                        <FlexBox2>
                            <LeftSectionHeader>Sponsorship</LeftSectionHeader>
                            <SectionBody>
                                {' '}
                                MHacks is the gateway between you and the top
                                tech talent in the world. Whether you come to
                                network, promote brand awareness, or get
                                feedback on a product or API, we’ll provide the
                                tools you need to make the most out of your
                                experience.{' '}
                            </SectionBody>
                            <SectionBody>
                                {' '}
                                Interested in sponsoring? Want more information?
                                Shoot us an email at{' '}
                                <Link href="mailto:sponsor@mhacks.org">
                                    sponsor@mhacks.org
                                </Link>{' '}
                            </SectionBody>
                        </FlexBox2>

                        <FlexBox>
                            <QuoteWrapper>
                                <QuoteText>
                                    {' '}
                                    “This was one of the most well organized
                                    student-run hackathons that we’ve ever
                                    sponsored.”{' '}
                                </QuoteText>
                                <CompanyName>
                                    <CompanyLogo src={GoogleLogo} />
                                </CompanyName>
                            </QuoteWrapper>
                            <QuoteWrapper>
                                <QuoteText>
                                    {' '}
                                    “The caliber and number of students that
                                    MHacks attracts is like no other hacking
                                    event.”{' '}
                                </QuoteText>
                                <CompanyName>
                                    <CompanyLogo src={WalmartLogo} />
                                </CompanyName>
                            </QuoteWrapper>
                        </FlexBox>
                    </SponsorshipContainer>
                    <SponsorLogos />
                </Container>
            </Wrapper>
        );
    }
}

export default Sponsorship;
