import React from 'react';
import styled from 'styled-components';

const HeaderLogoImage = require('../../../static/icons/blackout-logo.png');

/* Header Section */
const HeaderWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    display: flex;
    height: 90px;
    alignItems: center;
    justifyContent: flex-start;
`;

const HeaderLogoWrapper = styled.div`
    display: flex;
    alignItems: center;
    height: 90%;
`;

const HeaderLogo = styled.img`
    height: 90px;
    display: block;
`;

class Header extends React.Component {
    render() {
        return (
            <HeaderWrapper>
                <HeaderLogoWrapper>
                    <HeaderLogo src={HeaderLogoImage} />
                </HeaderLogoWrapper>
            </HeaderWrapper>
        );
    }
}

export default Header;
