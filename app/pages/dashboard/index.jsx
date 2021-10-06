import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ProfileThunks } from '../../actions';
import { getUserMetadata } from '../../util/user.js';
import ApplicationSection from './application_section.jsx';
import ProfileSection from './profile_section.jsx';
import TravelTicketSection from './travel_ticket_section.jsx';

import { PageContainer } from '../../components';

import { OrderedSet } from 'immutable';

const StyledPageContainer = styled(PageContainer)``;

const StyledDiv = styled.div`
    padding: 10px;
`;

const FullscreenColumnContainer = styled.div`
    max-width: 500px;
    margin: 0 auto;
    min-height: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 20px 50px 20px;
`;

const SectionHeader = styled.h2`
    text-transform: uppercase;
    font-size: 24px;
    color: ${props => props.color};
    margin: 0;
`;

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        const userData = this.props.userState.data.user;

        this.state = {
            birthday: userData.birthday
                ? new Date(userData.birthday).toISOString().split('T')[0]
                : '',
            university: userData.university || '',
            major: userData.major || '',
            avatars: userData.avatars || [],
            isResumeUploaded: userData.isResumeUploaded || false,
            notifications: OrderedSet()
        };

        this.onClickRequestEmailVerification = this.onClickRequestEmailVerification.bind(
            this
        );
    }

    onClickRequestEmailVerification(e) {
        e.preventDefault();

        var email = this.props.userState.data.user.email;

        this.props.dispatch(ProfileThunks.sendVerificationEmail(email));
    }

    renderEmailVerificationPage() {
        return (
            <PageContainer>
                <FullscreenColumnContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        Unverified Email
                    </SectionHeader>
                    <p>
                      Thank you for signing up! At the moment our email
                      verification service is down, so we will be manually
                      verifying all new sign-ups for the time being. Please
                      check back in again later, and if you're still having
                      issues, feel free to email director@mhacks.org. Thank
                      you for your patience!
                    </p>
                </FullscreenColumnContainer>
            </PageContainer>
        );
    }

    render() {
        const userData = this.props.userState.data;
        const { isEmailVerified } = getUserMetadata(userData);

        if (!isEmailVerified) {
            return this.renderEmailVerificationPage();
        }

        return (
            <StyledPageContainer backgroundColor="red">
                <FullscreenColumnContainer>
                    <StyledDiv>
                        <ProfileSection userData={userData} />
                        <ApplicationSection userData={userData} />
                        <TravelTicketSection />
                    </StyledDiv>
                </FullscreenColumnContainer>
            </StyledPageContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data,
        ticketState: state.ticketState
    };
}

export default connect(mapStateToProps)(Dashboard);
