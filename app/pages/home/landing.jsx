import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
const Logo = require('../../../static/icons/x-logo.png');
import { devices } from '../../styles';

const Wrapper = styled.div`
    background: ${props => props.theme.secondary};
    padding: 0;
    height: calc(100vh - 80px);
`;

const Container = styled.div`
    height: 100%;
    width: calc(100% - 60px);
    maxWidth: 1200px;
    margin: 0 auto;
    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    ${devices.tablet`
        width: calc(100% - 100px);
    `}

    ${devices.desktop`
        width: calc(100% - 140px);
    `}

    ${devices.giant`
        width: calc(100% - 160px);
    `}
`;

const LogoImage = styled.img`
    height: auto;
    width: auto;
    max-height: 50%;
    max-width: 90%;
    
    margin-bottom: 40px;
`;

const Text = styled.h2`
    fontSize: 24px;
    color: white;
    text-align: center;
    fontWeight: 500;
    textAlign: center;
    padding: 0 10vw;
    margin: 5px 0;
    
    ${devices.tablet`
        fontSize: 32px;
    `}
`;

class Landing extends React.Component {
    render() {
        return (
            <Wrapper>
                <Container>
                    <LogoImage src={Logo} />
                    <Text>MHacks X</Text>
                    <Text>September 22nd - 24th, 2017</Text>
                    <Text>University of Michigan North Campus</Text>
                </Container>
            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Landing);
