import styled from 'styled-components';
import devices from 'styles/devices';

export default styled.div`
  position: relative;
  z-index: 99999;
  color: ${props => props.dark ? props.theme.darkPink : props.theme.pink};
  float: ${props => (props.position === 'left') ? 'left' : 'right'};
  letter-spacing: 3px;
  fontSize: 2.0em;
  margin: 10px 0;

  ${devices.tablet`
    textAlign: left;
    minWidth: 30%;
    width: 100%;
    fontSize: 2.5em;
    paddingBottom: 10px;
  `}
  ${devices.desktop`
    textAlign: ${props => (props.position === 'left') ? 'left' : 'right'};
    min-width: 30%;
    width: 100%;
    fontSize: 2.5em;
  `}
  ${devices.giant`
    textAlign: ${props => (props.position === 'left') ? 'left' : 'right'};
    min-width: 30%;
    width: 70%;
    fontSize: 2.5em;
  `}
  

`;