import React from 'react';
import { PageContainer } from '../../components';

import Faq from './faq.jsx';
import About from './about.jsx';
import Apply from './apply.jsx';
import Welcome from './welcome.jsx';
import Sponsorship from './sponsorship.jsx'

/* Page Component */
class HomePage extends React.Component {
    render() {
        return (
            <PageContainer>
                <Welcome />
                <About />
                <Faq />
                <Sponsorship />
                <Apply />
            </PageContainer>
        );
    }
}

export default HomePage;
