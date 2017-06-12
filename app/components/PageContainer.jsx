import styled from 'styled-components';
import { devices } from '../styles';

const verticalMargin = 130;

const PageContainer = styled.div`
    display: flex;
    height: 100%;
    width: calc(100% - 40px);
    margin: ${verticalMargin}px auto 0 auto;
    overflowX: hidden;

    ${devices.small`
        width: calc(100% - 60px);
    `}

    ${devices.tablet`
        height: calc(100vh - ${verticalMargin*2}px);
        margin: ${verticalMargin}px auto;
    `}

    ${devices.desktop`
        width: 60%;
        height: calc(100vh - ${verticalMargin*2}px);
    `}
`;

export default PageContainer;
