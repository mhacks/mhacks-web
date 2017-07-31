import React from 'react';
import { PageContainer } from '../../components';

import Landing from './landing.jsx';
import Faq from './faq.jsx';
import Welcome from './welcome.jsx';
import Sponsorship from './sponsorship.jsx';
import HackingCategories from './hacking_categories.jsx';
import Animations from './detailed_animation.jsx';

/* Page Component */
class HomePage extends React.Component {
    render() {
        return (
            <PageContainer ref="pagecontainer">
                <Animations />
                <Landing />
                <Welcome />
                <HackingCategories />
                <Faq />
                <Sponsorship />
            </PageContainer>
        );
    }
}

export default HomePage;
