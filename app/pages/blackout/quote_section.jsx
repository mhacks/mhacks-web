import React from 'react';
import styled from 'styled-components';

import devices from '../../styles/devices';

import StartIcon from '../../../static/icons/quote_start.png';
import EndIcon from '../../../static/icons/quote_end.png';

const Wrapper = styled.section`
    padding: 70px 0;
`;

const QuoteSection = styled.div`
    position: relative;
    width: 100%
    margin: 0 auto;
    padding: 30px 55px 60px 50px;
    overflow: auto;

    ${devices.tablet`
         padding: 30px 55px 60px 50px;
         max-width: 75%;
    `}
`;

const Quote = styled.div`
    position: relative;
    color: ${props => props.color};
    float: ${props => (props.position === 'left' ? 'left' : 'right')};
    z-index: 10;
    letter-spacing: 3px;
    font-size: 2em;
    text-align: left;

    ${devices.tablet`
        text-align: ${props => (props.position === 'left' ? 'left' : 'right')};
        min-width: 30%;
        width: 100%;
        font-size: 2.5em;
        padding-bottom: 10px;
    `};
`;

const StartWrapper = styled.img`
    position: absolute;
    height: 20%;
    width: auto;
    z-index: 10;
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
    font-style: italic;
    clear: both;
    font-size: 2em;
    z-index: 9999;
    padding-bottom: 50px;
    text-align: left;

    ${devices.tablet`
      text-align: ${props => (props.position === 'right' ? 'right' : 'left')};
    `} ${devices.desktop`
      font-size: 2.5em;
      padding-bottom: 30px;
    `} ${devices.giant`
      padding-bottom: 20px;
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
