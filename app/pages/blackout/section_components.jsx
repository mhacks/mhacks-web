import styled from 'styled-components';

const SectionHeader = styled.h2`
    font-size: 50px;
    text-transform: uppercase;
    color: ${props => props.theme.teal};
    text-shadow: 0px 0px 50px ${props => props.theme.teal};
`;

const SectionBody = styled.p`
    color: white;
    font-size: 20px;
`;

export { SectionHeader, SectionBody };
