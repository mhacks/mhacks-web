import styled from 'styled-components';

const SectionHeader = styled.h2`
    fontSize: 50px;
    textTransform: uppercase;
    color: ${props => props.theme.teal};
    textShadow: 0px 0px 50px ${props => props.theme.teal};
`;

const SectionBody = styled.p`
    color: white;
    fontSize: 15px;
    paddingLeft: 100px;
`;

export { SectionHeader, SectionBody };

