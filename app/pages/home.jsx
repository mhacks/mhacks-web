import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import styled from 'styled-components';

import { routes } from '../constants';

const Container = styled.div`
    position: relative;
    height: 100%;
    font-weight: 30px;
    color: ${props => props.theme.primary1}
`;

class HomePage extends React.Component {
  componentDidMount() {
    this.props.dispatch(push(routes.HOME));
  }

  render() {
    return <Container>MHacks Unchained</Container>;
  }
}

function mapStateToProps(/*state*/) {
  return {};
}

export default connect(mapStateToProps)(HomePage);
