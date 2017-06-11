import styled from 'styled-components';
import { devices } from '../../styles';

const SectionHeader = styled.h2`
    fontSize: 40px;
    color: darkorange;
    fontWeight: 400;
    textAlign: center;

    ${devices.tablet`
        textAlign: left;
    `}
`;

const SectionBody = styled.p`
    color: gray;
    fontSize: 20px;
`;

export { SectionHeader, SectionBody };
