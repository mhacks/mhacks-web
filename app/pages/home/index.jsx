import React from 'react';

import styled from 'styled-components';

import Landing from './landing.jsx';
import Faq from './faq.jsx';
import Hero from './hero.jsx';
import Sponsorship from './sponsorship.jsx';
import HackingCategories from './hacking_categories.jsx';

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
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <iframe
                        src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%230a192e&amp;ctz=America%2FNew_York&amp;src=Y19iYmg4bms2cDdoYjR2ZGF0NzU0bHB0cmxnc0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%233F51B5&amp;mode=WEEK&amp;showNav=0&amp;showDate=0&amp;showPrint=0&amp;showTabs=0&amp;showTitle=0&amp;showCalendars=0"
                        style={{
                            width: '80%',
                            maxWidth: '800px',
                            height: '600px'
                        }}
                        frameBorder={false}
                        scrolling="no"
                    ></iframe>
                </div>
                <Hero backgroundColor={this.props.theme.primary} />
                <HackingCategories backgroundColor={this.props.theme.primary} />
                <Faq backgroundColor={this.props.theme.primary} />
                <Sponsorship backgroundColor={this.props.theme.primary} />
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
