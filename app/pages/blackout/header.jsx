import React from 'react';
import styled from 'styled-components';

import { Container } from '../../components';

const HeaderLogoImage = require('../../../static/icons/blackout-logo.png');

/* Header Section */
const HeaderWrapper = styled.div`
    display: flex;
    height: 90px;
    alignItems: center;
    justifyContent: center;
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

class BlackoutHeader extends React.Component {
    render() {
        return (
            <Container>
                <HeaderWrapper>
                    <HeaderLogoWrapper>
                        <HeaderLogo src={HeaderLogoImage} />
                    </HeaderLogoWrapper>
                </HeaderWrapper>
            </Container>
        );
    }
}

export default BlackoutHeader;
