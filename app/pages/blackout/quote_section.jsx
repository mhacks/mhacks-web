import React from 'react';
import styled from 'styled-components';

import devices from '../../styles/devices';

import StartIcon from '../../../static/icons/quote_start.png';
import EndIcon from '../../../static/icons/quote_end.png';

const Wrapper = styled.section`padding: 70px 0;`;

const QuoteSection = styled.div`
    position: relative;
    width: 100%
    margin: 0 auto;
    padding: 30px 55px 60px 50px;
    overflow: auto;

    ${devices.tablet`
         padding: 30px 55px 60px 50px;
         maxWidth: 75%;
    `}
`;

const Quote = styled.div`
    position: relative;
    color: ${props => props.color};
    float: ${props => (props.position === 'left' ? 'left' : 'right')};
    zIndex: 10;
    letter-spacing: 3px;
    fontSize: 2em;
    textAlign: left;

    ${devices.tablet`
        textAlign: ${props => (props.position === 'left' ? 'left' : 'right')};
        minWidth: 30%;
        width: 100%;
        fontSize: 2.5em;
        paddingBottom: 10px;
    `};
`;

const StartWrapper = styled.img`
    position: absolute;
    height: 20%;
    width: auto;
    zIndex: 10;
    visibility: hidden;
    left: 0;
    top: 0;

    ${devices.tablet`
        height: 20%;
        visibility: visible;
    `} ${devices.giant`
        height: 25%;
    `};
`;

const EndWrapper = styled.img`
    position: absolute;
    height: 20%;
    width: auto;
    visibility: hidden;
    right: 0;
    bottom: 4%;

    ${devices.tablet`
        height: 20%;
        visibility: visible;
        right: 3%;
        bottom: 10%;
    `} ${devices.desktop`
        bottom: 12%;
    `} ${devices.giant`
        height: 25%;
    `};
`;

const CompanyName = styled.div`
    position: relative;
    color: #a3a3a3;
    fontStyle: italic;
    clear: both;
    fontSize: 2em;
    zIndex: 9999;
    paddingBottom: 50px;
    textAlign: left;

    ${devices.tablet`
      textAlign: ${props => (props.position === 'right' ? 'right' : 'left')};
    `} ${devices.desktop`
      fontSize: 2.5em;
      paddingBottom: 30px;
    `} ${devices.giant`
      paddingBottom: 20px;
    `};
`;

export default () => (
    <Wrapper>
        <QuoteSection>
            <StartWrapper src={StartIcon} />
            <EndWrapper src={EndIcon} />
            <Quote color={props => props.theme.darkPink} position="left">
                This was one of the most well organized student-run hackathons
                that we’ve ever sponsored.
            </Quote>
            <CompanyName position="left">Google</CompanyName>
            <Quote color={props => props.theme.darkPink} position="right">
                The caliber and number of students that MHacks attracts is like
                no other hacking event.
            </Quote>
            <CompanyName position="right" dark>
                {' '}
                Walmart{' '}
            </CompanyName>
        </QuoteSection>
    </Wrapper>
);
