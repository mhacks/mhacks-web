import { css } from 'styled-components';

// device media queries for non-mobile -- design mobile first
export default {
  tablet: (...args) => css`
    @media (min-width: 768px) {
      ${css(...args)}
    }
  `,
  desktop: (...args) => css`
    @media (min-width: 992px) {
      ${css(...args)}
    }
  `,
  giant: (...args) => css`
    @media (min-width: 1200px) {
      ${css(...args)}
    }
  `
};
