import React from 'react';
import styled from 'styled-components';
import { devices } from '../../styles';
import {
    CenteredContainer,
    SectionHeader,
    Brick
} from './section_components.jsx';

import { SponsorLogos } from '../../components';
import theme from '../../styles/theme.js';

const Wrapper = styled.div`
    backgroundColor: white;
    padding: 80px 0;
`;

const SectionBody = styled.p`
    color: ${theme.secondary};
    fontSize: 16px;
    maxWidth: 600px;
`;

const FlexBox = styled.div`
    display: flex;
    justifyContent: center;
    flexWrap: wrap;
    maxWidth: 640px;

    ${devices.tablet`
        flexWrap: nowrap;
    `};
`;

const QuoteWrapper = styled.div`
    margin: 20px;
    justifyContent: center;
    padding: 0;
`;

const QuoteText = styled.div`
    color: ${theme.highlight};
    fontSize: ${theme.fontSize};
    textAlign: left;
`;

const CompanyName = styled.div`
    color: ${theme.highlight};
    fontSize: ${theme.fontSize};
    textAlign: right;
`;

const Link = styled.a`color: ${theme.secondary};`;

class Sponsorship extends React.Component {
    render() {
        return (
            <Wrapper>
                <CenteredContainer>
                    <Brick />
                    <SectionHeader>Sponsorship</SectionHeader>
                    <SectionBody>
                        {' '}
                        MHacks is the gateway between you and the top tech
                        talent in the world. Whether you come to network,
                        promote brand awareness, or get feedback on a product or
                        API, we’ll provide the tools you need to make the most
                        out of your experience.{' '}
                    </SectionBody>
                    <SectionBody>
                        {' '}
                        Interested in sponsoring? Want more information? Shoot
                        us an email at{' '}
                        <Link href="mailto:kevin@mhacks.org">
                            kevin@mhacks.org
                        </Link>{' '}
                    </SectionBody>

                    <FlexBox>
                        <QuoteWrapper>
                            <QuoteText>
                                {' '}
                                “This was one of the most well organized
                                student-run hackathons that we’ve ever
                                sponsored.”{' '}
                            </QuoteText>
                            <CompanyName> - Google </CompanyName>
                        </QuoteWrapper>
                        <QuoteWrapper>
                            <QuoteText>
                                {' '}
                                “The caliber and number of students that MHacks
                                attracts is like no other hacking event.”{' '}
                            </QuoteText>
                            <CompanyName> - Walmart </CompanyName>
                        </QuoteWrapper>
                    </FlexBox>

                    <SponsorLogos />
                </CenteredContainer>
            </Wrapper>
        );
    }
}

export default Sponsorship;
