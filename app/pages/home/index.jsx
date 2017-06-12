import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { devices } from '../../styles';

const Favicon = require('../../../static/blackout/favicon.png');

import Faq from './faq.jsx';
import Apply from './apply.jsx';
import WhatIsMHacksNano from './what_is_mhacks_nano.jsx';
import Schedule from './schedule.jsx';

import { SectionHeader, SectionBody } from './section_components.jsx';

const contentHeight = 130;
const sidebarWidth = 200;

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 80%;
    margin: ${contentHeight}px auto;

    ${devices.tablet`
        height: calc(100vh - ${contentHeight*2}px);
    `}

    ${devices.desktop`
        width: 60%;
        height: calc(100vh - ${contentHeight*2}px);
    `}

`;

const Sidebar = styled.div`
    display: None;
    width: ${sidebarWidth}px;

    ${devices.tablet`
        display: inline;
    `}
`;

const SidebarLinks = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
`;

const SidebarLink = styled.li`
    fontSize: 16px;
    padding: 10px 0;

    a {
        color: gray;
        textDecoration: none;
    }

    :hover {
        color: darkorange;
    }
`;

const Content = styled.div`
    width: 100%;
    height: 100%;

    ${devices.tablet`
        width: calc(100% - ${sidebarWidth}px);
        paddingRight: 50px;
        overflowX: hidden;
        overflowY: scroll;
    `}
`;

/* Page Component */
class HomePage extends React.Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>MHacks Nano</title>

                    <link rel="icon" type="image/x-icon" href={Favicon} />
                </Helmet>

                <Container>
                    <Sidebar>
                        <nav>
                            <SidebarLinks>
                                <SidebarLink><a href="#about">About MHacks</a></SidebarLink>
                                <SidebarLink><a href="#what-is-mhacks-nano">MHacks Nano</a></SidebarLink>
                                <SidebarLink><a href="#schedule">Schedule</a></SidebarLink>
                                <SidebarLink><a href="#faq">FAQ</a></SidebarLink>
                                <SidebarLink><a href="#apply">Apply</a></SidebarLink>
                            </SidebarLinks>
                        </nav>
                    </Sidebar>

                    <Content>
                        <div id="about">
                            <SectionHeader>About MHacks</SectionHeader>
                            <SectionBody>MHacks is a group of University of Michigan students who want to help you turn your ideas into reality. We're best known for the 36-hour hackathons we run twice a year. You're welcome to come with or without a team. We'll provide you with all the resources and mentors you need to help you work on something cool or learn new skills. You'll have the freedom to create a product, learn new techniques for your future work, or just have fun working on a project with friends. Moreover, we will offer you a chance to network with other creators and professionals. For newcomers and veterans alike, MHacks events are experiences you won’t want to miss.</SectionBody>
                        </div>

                        <div id="what-is-mhacks-nano">
                            <WhatIsMHacksNano />
                        </div>
                        <div id="schedule">
                            <Schedule />
                        </div>
                        <div id="faq">
                            <SectionHeader>Frequently Asked Questions</SectionHeader>
                            <Faq />
                        </div>
                        <div id="apply">
                            <Apply />
                        </div>
                    </Content>
                </Container>
            </div>
        );
    }
}

export default HomePage;
