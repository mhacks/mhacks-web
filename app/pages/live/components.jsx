import styled from 'styled-components';
import { devices } from '../../styles';

const SectionWrapper = styled.div`
    height: 100%;
    border-radius: 20px;
    padding: 20px;
    background: ${props => props.theme.generateBackgroundGradient(45, 0.2)};
`;

const SectionHeader = styled.h3`
    color: ${props => props.theme.highlight};
    text-align: center;
    text-transform: uppercase;
    font-size: 20px;
    font-weight: bold;
    margin: 0 0 20px 0;

    ${devices.small`
        font-size: 24px;
    `};
`;

export default {
    SectionWrapper,
    SectionHeader
};
