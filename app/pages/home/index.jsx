import React from 'react';
import styled from 'styled-components';
import { PageContainer, FullScreenAnimation } from '../../components';

import Landing from './landing.jsx';
import Faq from './faq.jsx';
import Welcome from './welcome.jsx';
import Sponsorship from './sponsorship.jsx';
import HackingCategories from './hacking_categories.jsx';

// Add overflow: hidden to container to prevent floating squares from escaping container
const StyledPageContainer = styled(PageContainer)`
    overflow: hidden;
`;

/* Page Component */
class HomePage extends React.Component {
    render() {
        return (
            <StyledPageContainer ref="pagecontainer">
                <FullScreenAnimation />
                <Landing />
                <Welcome />
                <HackingCategories />
                <Faq />
                <Sponsorship />
            </StyledPageContainer>
        );
    }
}

export default HomePage;
