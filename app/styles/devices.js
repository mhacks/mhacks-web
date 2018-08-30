import { css } from 'styled-components';

// device media queries for non-mobile -- design mobile first
export default {
    tiny: (...args) =>
        css`
            @media (min-width: 192px) {
                ${css(...args)};
            }
        `,
    small: (...args) =>
        css`
            @media (min-width: 576px) {
                ${css(...args)};
            }
        `,
    tablet: (...args) =>
        css`
            @media (min-width: 768px) {
                ${css(...args)};
            }
        `,
    desktop: (...args) =>
        css`
            @media (min-width: 992px) {
                ${css(...args)};
            }
        `,
    giant: (...args) =>
        css`
            @media (min-width: 1200px) {
                ${css(...args)};
            }
        `
};
