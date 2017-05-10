import React from 'react';
import styled from 'styled-components';
import devices from '../../../styles/devices';

import StartIcon from '../../../../static/icons/quote_start.png';
import EndIcon from '../../../../static/icons/quote_end.png';

const StartWrapper = styled.img`
    position: absolute;
    height: 20%;
    width: auto;
    overflow: visible;
    left: 0;
    top: 0;
    
    ${devices.desktop`
        height: 20%;
    `}
    
    ${devices.tablet`
        height: 20%;
    `}
    
    ${devices.giant`
        height: 25%;
    `}  
`;

const EndWrapper = styled.img`
    position: absolute;
    height: 20%;
    width: auto;
    right: 0;
    bottom: 8%;
  
  ${devices.desktop`
        height: 20%;
  `}
  
  ${devices.tablet`
        height: 20%;
        right: 3%;
  `}
  
  ${devices.giant`
        height: 25%;
  `}
`;

export const StartQuote = () => <StartWrapper src={StartIcon} />;
export const EndQuote = () => <EndWrapper src={EndIcon} />;
