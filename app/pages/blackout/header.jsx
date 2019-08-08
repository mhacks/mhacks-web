import React from 'react';
import styled from 'styled-components';

import { Container } from '../../components';

const HeaderLogoImage = require('../../../static/m12/logo.svg');

/* Header Section */
const HeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const HeaderLogoWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const HeaderLogo = styled.img`
    height: 90px;
    margin-top: 30px;
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
