import styled from 'styled-components';
import { devices } from '../../styles';

const SectionHeader = styled.h2`
    fontSize: 48px;
    color: ${props => props.theme.highlight};
    textTransform: uppercase;
    text-align: center;
    fontWeight: 500;
    textAlign: center;

    ${devices.tablet`
        textAlign: left;
    `}
`;

const SectionBody = styled.p`
    color: white;
    fontSize: 16px;
`;

export { SectionHeader, SectionBody };
