import React from 'react';
import styled from 'styled-components';
import { SectionHeader, SectionBody } from './section_components.jsx';

import { Container } from '../../components';
import { devices } from '../../styles';

const Orb1 = require('../../../static/blackout/orb-1.png');

const OrbImage1 = styled.img`
    height: 250px;
    width: auto;

    ${devices.tablet`
        height: 500px;
        position: relative;
        left: -20%;
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
    position: relative;
    text-align: center;

    ${devices.tablet`
        text-align: left;
        padding-left: 15%;
    `};
`;

const Body = styled(SectionBody)`
    position: relative;

    ${devices.tablet`
        left: -40%;
        width: 140%;
    `} ${devices.giant`
        left: -30%;
        width: 130%;
    `};
`;

class BlackoutWhatIsMHacks extends React.Component {
    render() {
        return (
            <Container>
                <Header>What is MHacks?</Header>
                <FlexBox>
                    <OrbImage1 src={Orb1} />
                    <div>
                        <Body>
                            MHacks is a 36-hour hackathon run by University of
                            Michigan students. At MHacks, we want to help you
                            turn your ideas into reality. You're welcome to come
                            with or without a team. We'll provide you with all
                            the resources and mentors you need to help you work
                            on something cool or learn new skills. You'll have
                            the freedom to create a product, learn new
                            techniques for your future work, or just have fun
                            working on a project with friends. Moreover, we will
                            offer you a chance to network with other creators
                            and professionals. For newcomers and veterans alike,
                            MHacks is a weekend experience you won’t want to
                            miss.
                        </Body>
                    </div>
                </FlexBox>
            </Container>
        );
    }
}

export default BlackoutWhatIsMHacks;
