import React from 'react';
import styled from 'styled-components';
import { SectionHeader, SectionBody } from './section_components';

const Wrapper = styled.div`
  margin: 0 auto;
    
`;

export default () => (
  <Wrapper>
    <SectionHeader> Sponsorship </SectionHeader>
      <SectionBody> Section Body </SectionBody>
  </Wrapper>
);