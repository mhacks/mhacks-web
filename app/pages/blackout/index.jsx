import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import Header from './header.jsx';
import Hero from './hero.jsx';
import WhatIsMHacks from './what_is_mhacks.jsx';
import Faq from './faq.jsx';
import Sponsorship from './sponsorship.jsx';
import QuoteSection from './quote_section';
import Footer from './footer.jsx';

const Favicon = require('../../../static/blackout/favicon.png');

/* Containers */
const Page = styled.div`
    background-color: black;
    width: 100%;
    height: 100%;
    color: #f1f7ff;
    overflowx: hidden;
`;

/* Styled elements */
const StyledHero = styled(Hero)`
    margin: 35px 0;
`;

/* Page Component */
class BlackoutPage extends React.Component {
    render() {
        return (
            <Page>
                <Helmet>
                    <title>MHacks</title>

                    <link rel="icon" type="image/x-icon" href={Favicon} />
                </Helmet>

                <Header />
                <StyledHero />
                <WhatIsMHacks />
                <Faq />
                <Sponsorship />
                <QuoteSection />
                <Footer />
            </Page>
        );
    }
}

export default BlackoutPage;
