import React from 'react';
import styled from 'styled-components';
import {SectionHeader, SectionBody, Links} from './section_components';
import { devices } from '../../styles';
import Orb from 'icons/orb_2.png';

const Wrapper = styled.div`
        display: flex;
        width: 115%;
        overflow: hidden;
`;

const OrbWrapper = styled.div`
        flexBasis: 0;
        display: none;
        flexGrow: 1;
        ${devices.tablet`
            flexBasis: 50%;
            display: block;
        `}
        
`;

const OrbImage = styled.img`
        display: flex;
        flexDirection: column;
        alignSelf: flex-start;
        width: 100%;
        height: auto;
        padding: 20px 0;

`;

const SectionWrapper = styled.div`
        flexGrow: 1;
        flexDirection: row;
        flexBasis: 50%;
        display: flex;
        alignSelf: flex-end;
        ${devices.tablet`
             flexBasis: 50%;
             display: block;
        `}
`;

const Section = styled.section`
        display: flex;
        flexDirection: column;
        flexBasis: 70%;
        justifyContent: center;
        ${devices.tablet`
             flexBasis: 90%;
             display: block;
        `}
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
                            MHacks is the gateway between you and the top tech talent in the world. Whether you come to network,
                            promote brand awareness, or get feedback on a product or API, we'll provide the tools you need to make the
                            most out of your experience.
                        </SectionBody>
                        <SectionBody>
                            Interested in sponsoring? Want more information? Shoot us an email at <Links
                            href="mailto:kevin@mhacks.org">kevin@mhacks.org</Links>
                        </SectionBody>
                    </Section>
                </CenterAlign>
            </SectionWrapper>
            <OrbWrapper>
                <OrbImage src={Orb}/>
            </OrbWrapper>
        </Wrapper>
    </div>
);
