import styled from 'styled-components';

const RoundedButton = styled.button`
    padding: 10px 0;
    borderRadius: 20px;
    backgroundColor: transparent;
    color: ${props => props.color};
    fontWeight: 500;
    fontSize: 16px;
    padding: 8px 60px;
    border: 3px solid ${props => props.color};

    &:hover {
        backgroundColor: ${props => props.color};
        color: white;
        ${props => props.hover};
    }
`;

export default RoundedButton;
