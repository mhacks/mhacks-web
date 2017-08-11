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
const CapitalOneImg = require('../../../static/logos/capitalone.png');
const CloudFlareImg = require('../../../static/logos/cloudflare.png');
const TargetImg = require('../../../static/logos/target.jpg');
const DelphiImg = require('../../../static/logos/delphi.jpg');
const GoldmanSachsImg = require('../../../static/logos/goldmansachs.jpg');
const MongoDBImg = require('../../../static/logos/mongodb.jpg');
const QualtricsImg = require('../../../static/logos/qualtrics.png');
const SalesforceImg = require('../../../static/logos/salesforce.png');
const WolframImg = require('../../../static/logos/wolfram.png');

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
    alignItems: center;
`;

const LogoWrapper = styled.div`
    margin: 25px;
`;

const SmallLogoImg = styled.img`
    height: 40px;
    width: auto;
    maxWidth: 100%;
`;

const MediumLogoImg = styled.img`
    height: 70px;
    width: auto;
    maxWidth: 100%;
`;

const LargeLogoImg = styled.img`
    height: 100px;
    width: auto;
    maxWidth: 100%;
`;

const SmallLogo = props =>
    <LogoWrapper>
        <a href={props.href}>
            <SmallLogoImg src={props.src} />
        </a>
    </LogoWrapper>;

const MediumLogo = props =>
    <LogoWrapper>
        <a href={props.href}>
            <MediumLogoImg src={props.src} />
        </a>
    </LogoWrapper>;

const LargeLogo = props =>
    <LogoWrapper>
        <a href={props.href}>
            <LargeLogoImg src={props.src} />
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
                        <LargeLogo
                            src={MicrosoftImg}
                            href="https://careers.microsoft.com/"
                        />
                        <MediumLogo
                            src={DRWImg}
                            href="https://drw.com/evolve"
                        />
                        <br />
                        <MediumLogo
                            src={NSAImg}
                            href="https://www.intelligencecareers.gov/nsa/"
                        />
                        <MediumLogo
                            src={LTSImg}
                            href="https://www.ltsnet.net/"
                        />
                        <br />
                        <SmallLogo src={TargetImg} />
                        <SmallLogo src={CloudFlareImg} />
                        <SmallLogo src={QualtricsImg} />
                        <SmallLogo src={GoldmanSachsImg} />
                        <SmallLogo src={DelphiImg} />
                        <SmallLogo src={WolframImg} />
                        <SmallLogo src={BloombergImg} />
                        <SmallLogo
                            src={FacebookImg}
                            href="https://www.facebook.com/careers/"
                        />
                        <SmallLogo
                            src={LyftImg}
                            href="https://www.lyft.com/jobs"
                        />
                        <SmallLogo
                            src={ICSImg}
                            href="https://www.intrepidcs.com/"
                        />
                        <SmallLogo src={CapitalOneImg} />
                        <SmallLogo
                            src={PalantirImg}
                            href="https://www.palantir.com/careers/"
                        />
                        <SmallLogo src={MongoDBImg} />
                        <SmallLogo src={SalesforceImg} />
                    </SponsorsFlexBox>
                </CenteredContainer>
            </Wrapper>
        );
    }
}

export default Sponsorship;
