import styled from 'styled-components';
import { devices } from '../../styles';

const SectionHeader = styled.h2`
    fontSize: 50px;
    textTransform: uppercase;
    color: ${props => props.theme.teal};
    textShadow: 0px 0px 50px ${props => props.theme.teal};
    
`;

const SectionBody = styled.p`
    color: white;
    fontSize: 1.8em;
    paddingLeft: 15%;
    paddingRight: 5%;
    
    ${devices.desktop`
        font-size: 2.0em;
    `}
`;

const Links = styled.a`
    color: white;
`;

export { SectionHeader, SectionBody, Links };
