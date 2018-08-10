import React from 'react';

import Landing from './landing.jsx';
import Faq from './faq.jsx';
import Hero from './hero.jsx';
import Sponsorship from './sponsorship.jsx';
import HackingCategories from './hacking_categories.jsx';

import Apply from './apply.jsx';

/* Page Component */
class HomePage extends React.Component {
    render() {
        return (
            <div>
                <Landing />
                <Apply />
                <Hero />
                <HackingCategories />
                <Faq />
                <Sponsorship />
            </div>
        );
    }
}

export default HomePage;
