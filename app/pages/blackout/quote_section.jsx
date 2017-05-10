import React from 'react';
import styled from 'styled-components';
import devices from 'styles/devices';
import StartIcon from 'icons/quote_start.png';
import EndIcon from 'icons/quote_end.png';



const Wrapper = styled.section`
    padding: 70px 0;
`;

const QuoteSection = styled.div`
    position: relative;
    width: 100%
    maxWidth: 75%;
    margin: 0 auto;
    padding: 30px 55px 60px 50px;
    overflow: auto;
  
    ${devices.tablet`
         padding: 30px 55px 60px 50px;
    `}
`;

const Quote = styled.div`
    position: relative;
    color: ${props => props.color};
    float: ${props => (props.position === 'left' ? 'left' : 'right')};
    zIndex: 1;
    letter-spacing: 3px;
    fontSize: 2.0em;
    textAlign: left;
    ${devices.tablet`
        minWidth: 30%;
        width: 100%;
        fontSize: 2.5em;
        paddingBottom: 10px;
    `}

  ${devices.desktop`
        textAlign: ${props => (props.position === 'left' ? 'left' : 'right')};
        min-width: 30%;
        width: 100%;
        fontSize: 2.5em;
  `}

  ${devices.giant`
        textAlign: ${props => (props.position === 'left' ? 'left' : 'right')};
        min-width: 30%;
        width: 70%;
        fontSize: 2.5em;
  `}
`;


const StartWrapper = styled.img`
    position: absolute;
    
    height: 20%;
    width: auto;
    zIndex: 1;
    visibility: hidden;
    left: 0;
    top: 0;
    
    ${devices.desktop`
        height: 20%;
        visibility: visible;
    `}
    
    ${devices.tablet`
        height: 20%;
        visibility: visible;
        
    `}
    
    ${devices.giant`
        height: 25%;
        visibility: visible;
    `}  
`;

const EndWrapper = styled.img`
    position: absolute;
    height: 20%;
    width: auto;
    visibility: hidden;
    right: 0;
    bottom: 2%;
  
  ${devices.desktop`
        height: 20%;
        visibility: visible;
  `}
  
  ${devices.tablet`
        height: 20%;
        visibility: visible;
        right: 3%;
  `}
  
  ${devices.giant`
        height: 25%;
        visibility: visible;
  `}
  
`;
const CompanyName = styled.div`
    position: relative;
    color: #a3a3a3;
    fontStyle: italic;
    clear: both;
    fontSize: 2.0em;
    zIndex: 9999;
    textAlign: left;
    
    ${devices.tablet`
      textAlign: 

    `}
    
    ${devices.desktop`
      fontSize: 2.5em;
      textAlign: ${props => (props.position === 'right' ? 'right' : 'left')};
    `}
    ${devices.giant`
      fontSize: 2.5em;
      textAlign: ${props => (props.position === 'right' ? 'right' : 'left')};
    `}
`;

export default () => (
  <Wrapper>
    <QuoteSection>
        <StartWrapper src={StartIcon} />
        <EndWrapper src={EndIcon} />
        <Quote color={props => props.theme.pink} position="left">
          This was one of the most well organized student-run hackathons that we’ve ever sponsored.
        </Quote>
      <CompanyName position="left">Google</CompanyName>
      <Quote color={props => props.theme.darkPink} position="right">
          The caliber and number of students that MHacks attracts is like no other hacking event.
      </Quote>
      <CompanyName position="right" dark> Walmart </CompanyName>
    </QuoteSection>
  </Wrapper>
);