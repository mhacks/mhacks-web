import React from 'react';
import styled from 'styled-components';
import { devices } from '../../styles';
import {
    CenteredContainer,
    SectionHeader,
    Brick
} from './section_components.jsx';
import theme from '../../styles/theme.js';

const BloombergImg = require('../../../static/logos/bloomberg.png');
const DRWImg = require('../../../static/logos/drw.png');
const FacebookImg = require('../../../static/logos/facebook.png');
const ICSImg = require('../../../static/logos/ics.png');
const LTSImg = require('../../../static/logos/lts.png');
const LyftImg = require('../../../static/logos/lyft.png');
const MicrosoftImg = require('../../../static/logos/microsoft.png');
const NSAImg = require('../../../static/logos/nsa.png');
const PalantirImg = require('../../../static/logos/palantir.jpg');

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
    `}
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

const Link = styled.a`
    color: ${theme.secondary};
`;

const SponsorsFlexBox = styled.div`
    display: flex;
    flexWrap: wrap;
    maxWidth: 850px;
    justifyContent: center;
`;

const LogoWrapper = styled.div`
    margin: 25px;
`;

const LogoImg = styled.img`
    height: 75px;
    width: auto;
    maxWidth: 100%;
`;

const Logo = props =>
    <LogoWrapper>
        <a href={props.href}>
            <LogoImg src={props.src} />
        </a>
    </LogoWrapper>;

class Sponsorship extends React.Component {
    render() {
        return (
            <Wrapper>
                <CenteredContainer>
                    <Brick />
                    <SectionHeader>Sponsorship</SectionHeader>
                    <SectionBody>
                        {' '}MHacks is the gateway between you and the top tech
                        talent in the world. Whether you come to network,
                        promote brand awareness, or get feedback on a product or
                        API, we’ll provide the tools you need to make the most
                        out of your experience.{' '}
                    </SectionBody>
                    <SectionBody>
                        {' '}Interested in sponsoring? Want more information?
                        Shoot us an email at{' '}
                        <Link href="mailto:kevin@mhacks.org">
                            kevin@mhacks.org
                        </Link>{' '}
                    </SectionBody>

                    <FlexBox>
                        <QuoteWrapper>
                            <QuoteText>
                                {' '}“This was one of the most well organized
                                student-run hackathons that we’ve ever
                                sponsored.”{' '}
                            </QuoteText>
                            <CompanyName> - Google </CompanyName>
                        </QuoteWrapper>
                        <QuoteWrapper>
                            <QuoteText>
                                {' '}“The caliber and number of students that
                                MHacks attracts is like no other hacking event.”{
                                    ' '
                                }
                            </QuoteText>
                            <CompanyName> - Walmart </CompanyName>
                        </QuoteWrapper>
                    </FlexBox>

                    <SponsorsFlexBox>
                        <Logo src={BloombergImg} />
                        <Logo src={DRWImg} href="https://drw.com/evolve" />
                        <Logo
                            src={FacebookImg}
                            href="https://www.facebook.com/careers/"
                        />
                        <Logo
                            src={ICSImg}
                            href="http://www.controls-ics.com/"
                        />
                        <Logo src={LTSImg} href="https://www.ltsnet.net/" />
                        <Logo src={LyftImg} href="https://www.lyft.com/jobs" />
                        <Logo
                            src={MicrosoftImg}
                            href="https://careers.microsoft.com/"
                        />
                        <Logo
                            src={NSAImg}
                            href="https://www.intelligencecareers.gov/nsa/"
                        />
                        <Logo
                            src={PalantirImg}
                            href="https://www.palantir.com/careers/"
                        />
                    </SponsorsFlexBox>
                </CenteredContainer>
            </Wrapper>
        );
    }
}

export default Sponsorship;
