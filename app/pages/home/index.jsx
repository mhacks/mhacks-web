import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { devices } from '../../styles';
import { PageContainer } from '../../components';

const Favicon = require('../../../static/blackout/favicon.png');

import Faq from './faq.jsx';
import About from './about.jsx';
import Apply from './apply.jsx';
import WhatIsMHacksNano from './what_is_mhacks_nano.jsx';
import Rules from './rules.jsx';
import Schedule from './schedule.jsx';
import Sponsorship from './sponsorship.jsx'

const sidebarWidth = 200;

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

                <PageContainer>
                    <Sidebar>
                        <nav>
                            <SidebarLinks>
                                <SidebarLink><a href="#about">About MHacks</a></SidebarLink>
                                <SidebarLink><a href="#what-is-mhacks-nano">MHacks Nano</a></SidebarLink>
                                <SidebarLink><a href="#schedule">Schedule</a></SidebarLink>
                                <SidebarLink><a href="#rules">Rules</a></SidebarLink>
                                <SidebarLink><a href="#faq">FAQ</a></SidebarLink>
                                <SidebarLink><a href="#sponsorship">Sponsorship</a></SidebarLink>
                                <SidebarLink><a href="#apply">Apply</a></SidebarLink>
                            </SidebarLinks>
                        </nav>
                    </Sidebar>

                    <Content>
                        <div id="about">
                            <About />
                        </div>
                        <div id="what-is-mhacks-nano">
                            <WhatIsMHacksNano />
                        </div>
                        <div id="schedule">
                            <Schedule />
                        </div>
                        <div id="rules">
                            <Rules />
                        </div>
                        <div id="faq">
                            <Faq />
                        </div>
                        <div id="sponsorship">
                            <Sponsorship />
                        </div>
                        <div id="apply">
                            <Apply />
                        </div>
                    </Content>
                </PageContainer>
            </div>
        );
    }
}

export default HomePage;
