import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Header from './header.jsx';
import Hero from './hero.jsx';
import Faq from './faq.jsx';

/* Containers */
const Page = styled.div`
    backgroundColor: black;
    width: 100%;
    height: 100%;
    color: #F1F7FF;
`;

/* Styled elements */
const StyledHero = styled(Hero)`
    margin: 35px 0;
`;

const StyledFaq = styled(Faq)``;

/* Page Component */
class BlackoutPage extends React.Component {
    render() {
        return (
            <Page>
                <Header />
                <StyledHero />
                <StyledFaq />
            </Page>
        );
    }
}

function mapStateToProps(/*state*/) {
    return {};
}

export default connect(mapStateToProps)(BlackoutPage);
