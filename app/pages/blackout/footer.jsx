import React from 'react';
import styled from 'styled-components';

import { Container } from '../../components';

const HeaderLogoImage = require('../../../static/icons/blackout-logo.png');

const InstagramImg = require('../../../static/icons/Instagram.png');
const FacebookImg = require('../../../static/icons/Facebook.png');
const TwitterImg = require('../../../static/icons/Twitter.png');

/* Footer Style */
const Footer = styled.footer`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  text-align: center;
`;

const Text = styled.h2`
    fontSize: 16px;
    marginBottom: 0;
    textAlign: left;
`;

const HeaderLogo = styled.img`
  	display: block;
    height: 90px;
`;

const ImgButton = styled.img`
	margin: 10px;
	padding: 5px;
    height: 50px;
    display: inline-block;
`;


class BlackoutFooter extends React.Component {
    render() {
        return (
            <Container>
                <Footer>
                    <Text>
                        © MHacks 2017
                    </Text>
                    <HeaderLogo src={HeaderLogoImage} align="middle"/>
                    <ImgButton src={FacebookImg} alt="Facebook" align="middle"/>
                    <ImgButton src={InstagramImg} alt="Instagram" align="middle"/>
                    <ImgButton src={TwitterImg} alt="Twitter" align="middle"/>
                </Footer>
            </Container>
        );
    }
} 

export default BlackoutFooter;