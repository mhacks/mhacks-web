import React from 'react';
import styled from 'styled-components';
import { SectionHeader, SectionBody } from './section_components.jsx';
import { ProfilePicture } from '../../components';

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
    align-items: center;
`;

const ProfileContainer = styled.div`
    width: 100px;
    height: auto;
`;

const ContentContainer = styled.div`
    margin-left: 10px;
`;

class ProfileSection extends React.Component {
    render() {
        const user = this.props.userData.user;

        return (
            <div>
                <SectionHeader>Profile</SectionHeader>
                <Container>
                    <FlexBox>
                        <ProfileContainer>
                            <ProfilePicture avatars={user.avatars} />
                        </ProfileContainer>
                        <ContentContainer>
                            <StyledSectionBody>{user.name}</StyledSectionBody>
                            <StyledSectionBody>
                                {user.university}
                            </StyledSectionBody>
                            <StyledSectionBody>{user.major}</StyledSectionBody>
                        </ContentContainer>
                    </FlexBox>
                </Container>
            </div>
        );
    }
}

export default ProfileSection;
