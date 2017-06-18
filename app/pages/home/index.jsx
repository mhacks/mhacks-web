import React from 'react';
import styled from 'styled-components';
import { devices } from '../../styles';
import { PageContainer } from '../../components';

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

const VerticalLine = styled.div`
    display: None;

    ${devices.tablet`
        display: inline;
        width: 5px;

        background: -moz-linear-gradient(top, rgba(255,214,94,1) 0%, rgba(254,191,4,0) 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(top, rgba(255,214,94,1) 0%,rgba(254,191,4,0) 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to bottom, rgba(255,214,94,1) 0%,rgba(254,191,4,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffd65e', endColorstr='#00febf04',GradientType=0 ); /* IE6-9 */

        marginRight: 50px;
    `}
`;

/* Page Component */
class HomePage extends React.Component {
    render() {
        return (
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

                <VerticalLine />

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
        );
    }
}

export default HomePage;
