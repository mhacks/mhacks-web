import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    height: 90px;
    backgroundColor: gray;
`;

class Footer extends React.Component {
    render() {
        return (
            <FooterWrapper />
        );
    }
}

export default Footer;
