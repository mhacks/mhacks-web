import React from 'react';
import { PageContainer } from '../../components';

import Landing from './landing.jsx';
import Faq from './faq.jsx';
import Welcome from './welcome.jsx';
import Sponsorship from './sponsorship.jsx';
import HackingCategories from './hacking_categories.jsx';

/* Page Component */
class HomePage extends React.Component {
    render() {
        return (
            <PageContainer>
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
