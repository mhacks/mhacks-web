import React from 'react';
import styled from 'styled-components';
import { SectionHeader, SectionBody } from './section_components';
import Orb from 'icons/orb_2.png';

const Wrapper = styled.div`
  display: flex;
  width: 115%;
  overflow: hidden;
    
`;

const TextWrapper = styled.div`
    flex-direction: column;
    
`;
const OrbWrapper = styled.div`
    flexBasis: 50%;
    // backgroundColor:red;
  
    
`;
const OrbImage = styled.img`
  width: 100%;
  height: auto;
`;
const Section = styled.section`
  minWidth: 400px;
  flex-direction: column;
  justify-content: center;
  width: 700px;
`;

export default () => (
  <div style={{overflow: 'hidden', display: 'flex'}}>
    <Wrapper>
      <TextWrapper>
        <Section>
          <SectionHeader> Sponsorship </SectionHeader>
          <SectionBody>
            MHacks is the gateway between you and the top tech talent in the world. Whether you come to network, promote brand awareness, or get feedback on a product or API, we'll provide the tools you need to make the most out of your experience.
          </SectionBody>

        </Section>
      </TextWrapper>
      <OrbWrapper>
        <OrbImage src={Orb}/>
      </OrbWrapper>
    </Wrapper>
  </div>
);
