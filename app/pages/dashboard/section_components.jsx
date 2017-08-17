import styled from 'styled-components';

const SectionHeader = styled.h2`
    fontSize: 25px;
    color: ${props => props.theme.highlight};
    textTransform: uppercase;
    //display: inline;
    marginBottom: 5px;
`;

const SectionBody = styled.p`
    color: ${props => props.theme.highlight};
    fontSize: 16px;
    max-width: 600px;
`;

export { SectionHeader, SectionBody };
