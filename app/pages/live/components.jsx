import styled from 'styled-components';
import { devices } from '../../styles';

const SectionWrapper = styled.div`
    height: 100%;
    borderRadius: 20px;
    padding: 20px;
    background: ${props => props.theme.generateBackgroundGradient(45, 0.2)};
`;

const SectionHeader = styled.h3`
    color: ${props => props.theme.highlight};
    textAlign: center;
    textTransform: uppercase;
    fontSize: 20px;
    fontWeight: bold;
    margin: 0 0 20px 0;

    ${devices.small`
        fontSize: 24px;
    `};
`;

export default {
    SectionWrapper,
    SectionHeader
};
