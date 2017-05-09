import React from 'react';
import styled from 'styled-components';

import { devices } from '../../styles';
import { connect } from 'react-redux';
import Header from './header.jsx';
import Hero from './hero.jsx';
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
const Subhead = styled.h3`
    marginBottom: 30px;
    fontSize: 20px;
`;

const Anchor = styled.a`
    marginLeft: 10px;
    color: #BFBFBF;
`;

/* Footer Section */
const Footer = styled.div`
    display: flex;
    flexWrap: wrap;
    justifyContent: space-between;
    alignItems: flex-end;
    height: 10%;
`;

const Left = styled.div`
    ${devices.tablet`
        marginLeft: 10px;
        marginRight: 10px;
    `}
`;

const Right = styled.div`
    ${devices.tablet`
        marginLeft: 10px;
        marginRight: 10px;
    `}
`;

const HeroWrapper = styled.div`
    margin: 35px 0;
`;

/* Page Component */
class BlackoutPage extends React.Component {
    render() {
        return (
            <Page>
                <Header />
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

function mapStateToProps(state) {
    return {
        status: state.subscribeState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(BlackoutPage);
