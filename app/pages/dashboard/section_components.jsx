import styled from 'styled-components';

const SectionHeader = styled.h2`
    font-size: 25px;
    color: ${props => props.theme.highlight};
    text-transform: uppercase;
    //display: inline;
    margin-bottom: 5px;
`;

const SectionBody = styled.p`
    color: ${props => props.theme.highlight};
    font-size: 16px;
    max-width: 600px;
`;

export { SectionHeader, SectionBody };
