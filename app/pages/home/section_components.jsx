import styled from 'styled-components';
import { devices } from '../../styles';
import theme from '../../styles/theme';

const CenteredContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    width: calc(100% - 60px);
    max-width: 1200px;
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

const SectionHeader = styled.h2`
    display: block;
    font-size: 48px;
    font-weight: 900;
    min-width: 100%;
    text-align: center;
    color: ${theme.highlight};
    padding-top: 50px;

    ${devices.tiny`
        font-size: 32px;
    `};
`;

const SectionBody = styled.p`
    color: white;
    font-size: 16px;
    max-width: 600px;
`;

const Brick = styled.div`
    width: 100px;
    height: 12px;
    background: ${props => props.theme.highlight};
`;

export { CenteredContainer, SectionHeader, SectionBody, Brick };
