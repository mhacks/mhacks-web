import React from 'react';
import styled from 'styled-components';
import { SectionHeader, SectionBody } from './section_components.jsx';

import { Container } from '../../components';
import { devices } from '../../styles';

const OrbImage = require('../../../static/blackout/orb-2.png');

const Orb = styled.img`
    order: -1;
    height: 250px;
    width: auto;

    ${devices.tablet`
        order: 2;
        height: 400px;
        position: relative;
        left: 16%;
        top: -200px;
    `};
`;

const FlexBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    ${devices.tablet`
        flex-wrap: nowrap;
    `};
`;

const Header = styled(SectionHeader)`
    text-align: center;

    ${devices.tablet`
        text-align: left;
    `};
`;

const Body = styled(SectionBody)`
    position: relative;

    ${devices.tablet`
        left: 15%;
        width: 105%;
    `};
`;

const EmailBody = styled(Body)`
    font-weight: 500;
`;

const Link = styled.a`
    color: white;
`;

const StyledContainer = styled(Container)`
    ${devices.tablet`
        margin-bottom: -150px;
    `};
`;

export default () => (
    <StyledContainer>
        <Header>Sponsorship</Header>
        <FlexBox>
            <div>
                <Body>
                    MHacks is the gateway between you and the top tech talent in
                    the world. Whether you come to network, promote brand
                    awareness, or get feedback on a product or API, we'll
                    provide the tools you need to make the most out of your
                    experience.
                </Body>
                <EmailBody>
                    Interested in sponsoring? Want more information? Shoot us an
                    email at{' '}
                    <Link href="mailto:sponsor@mhacks.org">
                        sponsor@mhacks.org
                    </Link>
                </EmailBody>
            </div>
            <Orb src={OrbImage} />
        </FlexBox>
    </StyledContainer>
);
