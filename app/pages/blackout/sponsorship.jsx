import React from 'react';
import styled from 'styled-components';
import { SectionHeader, SectionBody, Links } from './section_components';
import Orb from 'icons/orb_2.png';

const Wrapper = styled.div`
  display: flex;
  width: 130%;
  overflow: hidden;
    
`;

const TextWrapper = styled.div`
    display: flex;

    
`;
const OrbWrapper = styled.div`
    flexBasis: 50%;
    flexGrow: 1;
    
  
    
`;
const OrbImage = styled.img`
  display: flex;
  flexDirection: column;
  alignSelf: flex-start;
  width: 100%;
  height: auto;
  
`;
const SectionWrapper = styled.div`
  flexGrow: 1;
  flexDirection: row;
  flexBasis: 50%;
  display: flex;
  alignSelf: flex-end;

`;
const Section = styled.section`
    display: flex;
    flexDirection: column;
    flexBasis: 80%;
    justifyContent: center;

`;
const CenterAlign = styled.div`
  display: flex;
  flexDirection: row;
  justifyContent: center;

`;

export default () => (
  <div style={{overflow: 'hidden'}}>
    <Wrapper>
        <SectionWrapper>
            <CenterAlign>
              <Section>
                <SectionHeader> Sponsorship </SectionHeader>
                <SectionBody>
                  MHacks is the gateway between you and the top tech talent in the world. Whether you come to network, promote brand awareness, or get feedback on a product or API, we'll provide the tools you need to make the most out of your experience.
                </SectionBody>
                <SectionBody>
                  Interested in sponsoring? Want more information? Shoot us an email at <Links href="mailto:kevin@mhacks.org">kevin@mhacks.org</Links>
                </SectionBody>
              </Section>

            </CenterAlign>
        </SectionWrapper>

      <OrbWrapper>
        <OrbImage src={Orb}/>
      </OrbWrapper>
      <TextWrapper>

      </TextWrapper>
    </Wrapper>
  </div>
);
