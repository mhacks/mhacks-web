import React from 'react';
import { PageContainer } from '../../components';

import Faq from './faq.jsx';
import Apply from './apply.jsx';
import Welcome from './welcome.jsx';
import Sponsorship from './sponsorship.jsx'
import HackingCategories from './hacking_categories.jsx';

/* Page Component */
class HomePage extends React.Component {
    render() {
        return (
            <PageContainer>
                <Welcome />
                <HackingCategories />
                <Faq />
                <Sponsorship />
                <Apply />
            </PageContainer>
        );
    }
}

export default HomePage;
