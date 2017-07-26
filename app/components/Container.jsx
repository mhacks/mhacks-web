import styled from 'styled-components';
import { devices } from '../styles';

const Container = styled.div`
    width: calc(100% - 60px);
    maxWidth: 1200px;
    margin: 0 auto;

    z-index: 98;

    ${devices.tablet`
        width: calc(100% - 100px);
    `} ${devices.desktop`
        width: calc(100% - 140px);
    `} ${devices.giant`
        width: calc(100% - 160px);
    `};
`;

export default Container;
