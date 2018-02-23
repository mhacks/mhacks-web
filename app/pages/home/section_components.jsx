import styled from 'styled-components';
import { devices } from '../../styles';

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
    font-size: 42px;
    color: ${props => props.theme.highlight};
    text-transform: uppercase;
    text-align: center;
    font-weight: 500;
    text-align: center;

    ${devices.small`
    font-size: 48px;
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
