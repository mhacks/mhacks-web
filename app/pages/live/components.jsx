import styled from 'styled-components';

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
    fontSize: 24px;
    fontWeight: bold;
    margin: 0 0 20px 0;
`;

export default {
    SectionWrapper,
    SectionHeader
};
