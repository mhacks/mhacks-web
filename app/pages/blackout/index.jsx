import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Header from './header.jsx';
import Hero from './hero.jsx';
import Faq from './faq.jsx';
import QuoteSection from './QuoteSection/index';

/* Containers */
const Page = styled.div`
    width: 100%;
    color: #F1F7FF;
`;

const FlexBox = styled.div`
    display: flex;
`;

const VerticalCenter = styled.div`
    alignSelf: center;
    margin: auto;
    display: block;
    position: relative;
    paddingBottom: 30px;
    textAlign: center;
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
                <HeroWrapper>
                    <Hero />
                </HeroWrapper>
                <FlexBox>
                    <VerticalCenter>
                        <Subhead>Subscribe for Updates</Subhead>
                    </VerticalCenter>
                </FlexBox>
            <QuoteSection />
            <Footer>
              <Left>
                Have any questions?
                <Anchor href="mailto:hackathon@umich.edu">
                  hackathon@umich.edu
                </Anchor>
              </Left>
              <Right>
                Sponsorship inquiries:
                <Anchor href="mailto:sponsor-mhacks@umich.edu">
                  sponsor-mhacks@umich.edu
                </Anchor>
              </Right>
            </Footer>
            </Page>
        );
    }
}

function mapStateToProps(/*state*/) {
    return {};
}

export default connect(mapStateToProps)(BlackoutPage);
