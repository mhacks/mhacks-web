import React from 'react';

import styled from 'styled-components';

import Landing from './landing.jsx';
import Faq from './faq.jsx';
import Hero from './hero.jsx';
import Sponsorship from './sponsorship.jsx';
import HackingCategories from './hacking_categories.jsx';

import Apply from './apply.jsx';
import connect from 'react-redux/es/connect/connect';

const BodyDiv = styled.div`
    background: ${props => props.theme.primary};
`;

/* Page Component */
class HomePage extends React.Component {
    render() {
        return (
            <BodyDiv>
                <Landing />
                <Apply />
                <Hero />
                <HackingCategories />
                <Faq />
                <Sponsorship />
            </BodyDiv>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(HomePage);
