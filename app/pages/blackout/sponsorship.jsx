import React from 'react';
import styled from 'styled-components';
import devices from 'styles/devices';
import { SectionHeader, SectionBody } from './section_components';
import Orb from 'icons/orb_2.png';

const Wrapper = styled.div`
    display: flex;
    // justifyContent: space-between;
`;
const OrbImageWrapper = styled.div`
    display: flex;
    overflow: hidden;
    width: 80%;
    alignItems: right;
`;
const OrbImage = styled.img`
    position: relative;
    left: 30%;
    alignItems: right;
    height: auto;
    width: 100%;
`;
const Column = styled.div`
  width: auto;
  
    
`;
export default () => (
  <Wrapper>
    <Column>
      <SectionHeader> Sponsorship </SectionHeader>
      <SectionBody> Section Body </SectionBody>
    </Column>
    <OrbImageWrapper>
      <OrbImage src={Orb} />
    </OrbImageWrapper>

  </Wrapper>
);