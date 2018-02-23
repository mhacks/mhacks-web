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

const StyledPageContainer = styled(PageContainer)`
    background: ${props => props.theme.secondary};
`;

const StyledDiv = styled.div`
    background: ${props => props.theme.secondary};
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

const Link = styled.a`
    color: ${props => props.color};
    cursor: pointer;
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
        const userData = this.props.userState.data;
        return (
            <PageContainer>
                <FullscreenColumnContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        Unverified Email
                    </SectionHeader>
                    <p>
                        You should have received a verification email at{' ' +
                            userData.email}. If not, you can request another one
                        by clicking{' '}
                        <Link
                            onClick={this.onClickRequestEmailVerification}
                            color={this.props.theme.highlight}
                        >
                            here
                        </Link>. After you verify your email you can continue
                        setting up your profile!
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
