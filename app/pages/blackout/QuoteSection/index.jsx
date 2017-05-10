import React from 'react';
import Quote from './quote';
import CompanyName from './company_name';
import Wrapper from './wrapper';
import { StartQuote, EndQuote } from './quote_image';

export default () => (
  <Wrapper>

    <StartQuote />
    <EndQuote />
    <Quote position="left">
      This was one of the most well organized student-run hackathons that we’ve ever sponsored.
      <CompanyName position="left">
        Google
      </CompanyName>
    </Quote>
    <Quote position="right" dark>
      The caliber and number of students that MHacks attracts is like no other hacking event.
      <CompanyName position="right" dark> Walmart </CompanyName>
    </Quote>

  </Wrapper>
);