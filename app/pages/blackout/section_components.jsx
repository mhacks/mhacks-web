import styled from 'styled-components';

const SectionHeader = styled.h2`
    fontSize: 50px;
    textTransform: uppercase;
    color: ${props => props.theme.teal};
    textShadow: 0px 0px 50px ${props => props.theme.teal};
`;

const SectionBody = styled.p`
    color: white;
    fontSize: 2em;
    paddingLeft: 100px;
`;

const Links = styled.a`
    color: white;
`;

export { SectionHeader, SectionBody, Links };
