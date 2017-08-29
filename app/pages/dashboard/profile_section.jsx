import React from 'react';
import styled from 'styled-components';
import { SectionHeader, SectionBody } from './section_components.jsx';

const StyledSectionBody = styled(SectionBody)`
    color: white;
    margin: 5px auto;
`;

const Container = styled.div`
    background: ${props => props.theme.gradientOverlay}, ${props =>
    props.theme.primary}
    padding: 10px;
`;

const FlexBox = styled.div`
    display: flex;
    alignItems: center;
`;

const Avatar = styled.img`
    margin: 20px;
    width: 100px;
    height: 100px;
`;

class ProfileSection extends React.Component {
    render() {
        const user = this.props.userData.user;

        return (
            <div>
                <SectionHeader>Profile</SectionHeader>
                <Container>
                    <FlexBox>
                        <Avatar src="http://via.placeholder.com/100x100" />
                        <div>
                            <StyledSectionBody>
                                {user.name}
                            </StyledSectionBody>
                            <StyledSectionBody>
                                {user.university}
                            </StyledSectionBody>
                            <StyledSectionBody>
                                {user.major}
                            </StyledSectionBody>
                        </div>
                    </FlexBox>
                </Container>
            </div>
        );
    }
}

export default ProfileSection;
