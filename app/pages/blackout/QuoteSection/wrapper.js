import styled from 'styled-components';
import devices from 'styles/devices';

export default styled.section`
  position: relative;
  width: 100%
  maxWidth: 80%;
  margin: 0 auto;
  padding: 30px 55px 60px 50px;
  overflow: auto;
  
   ${devices.tablet`
      padding: 30px 55px 60px 50px;
    `}
`;