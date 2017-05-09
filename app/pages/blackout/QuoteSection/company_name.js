import styled from 'styled-components';

export default styled.div`
  color: ${props => props.dark ? props.theme.darkPink : props.theme.pink};
  fontStyle: italic;
  textAlign: ${props => (props.position === 'right') ? 'right' : 'left'};
`;