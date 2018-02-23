import styled from 'styled-components';

const RoundedButton = styled.button`
    padding: 10px 0;
    border-radius: 20px;
    background-color: transparent;
    color: ${props => props.color};
    font-weight: 500;
    font-size: 16px;
    padding: 8px 60px;
    border: 3px solid ${props => props.color};

    &:hover {
        background-color: ${props => props.color};
        color: white;
        ${props => props.hover};
    }
`;

export default RoundedButton;
