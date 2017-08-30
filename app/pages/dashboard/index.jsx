import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ProfileThunks } from '../../actions';
import { getUserMetadata } from '../../util/user.js';
import ApplicationSection from './application_section.jsx';
import ProfileSection from './profile_section.jsx';
import ExpandingItem from './ExpandingItem';
import { endpoints } from '../../constants';

import { PageContainer } from '../../components';

import { OrderedSet } from 'immutable';

const FaqItem = props => (
    <ExpandingItem
        {...props}
        expandColor
        colorOn={props => props.theme.highlightSecondary}
        colorOff={props => props.theme.highlight}
    />
);

const StyledPageContainer = styled(PageContainer)`
    background: ${props => props.theme.secondary};
`;

const StyledDiv = styled.div`
    background: ${props => props.theme.secondary};
    padding: 10px;
`;

const FullscreenColumnContainer = styled.div`
    maxWidth: 500px;
    margin: 0 auto;
    minHeight: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 20px 50px 20px;
`;

const SectionHeader = styled.h2`
    textTransform: uppercase;
    fontSize: 24px;
    color: ${props => props.color};
    margin: 0;
`;

const Link = styled.a`
    color: ${props => props.color};
    cursor: pointer;
`;

const Seperator = styled.div`
    background: ${props => props.theme.highlight};
    width: 100
    height: 2px;
    margin: 15px auto;
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

    renderTicketInfo() {
        return (
            <div>
                <p>Check your email for this qr code</p>
                <img src={endpoints.TICKET} width="100%" />
            </div>
        );
    }

    renderTravelInfo() {
        return (
            <p>
                Please plan to arrive in Ann Arbor before 6pm on Friday,
                September 22nd. Registration will begin at 4pm and end at 6pm.
                Late registration will be available at the Help Desk. Closing
                Ceremonies will last until about 5pm on Sunday, September 24th.{' '}
                <br /> <br />
                <strong>MHacks Buses</strong>: We will be sending buses to
                several campuses across the nation, stay tuned for more details
                in the coming weeks. <br /> <br />
                <strong>Flying</strong>: MHacks airport shuttles will pickup
                from DTW at 2:30pm and 4pm on Friday, September 22nd. Airport
                shuttles will leave from Ann Arbor at 6pm on Sunday, September
                24th. Please book flights accordingly so that you can ride one
                of the shuttles - travel between the airport and Ann Arbor will
                not be reimbursed. <br /> <br />
                <strong>Driving</strong>: Free parking will be available after
                4pm on Friday, September 22nd first-come first-serve at parking
                lots on campus.
            </p>
        );
    }

    renderTravelReimbursement() {
        return (
            <div>
                <h4>
                    Travel Reimbursement Offered: Up to ${this.props.userState.data.user.reimbursement}
                </h4>
                <p>
                    To remain eligible for your reimbursement, you must email
                    flymhacks@umich.edu with any relevant receipts, ticket
                    confirmations, etc. within 5 days of application acceptance.{' '}
                    <br /> <br />If you are driving, please indicate as such on
                    the confirmation form - you will have until September 30th
                    to send a single email to flymhacks@umich.edu with all costs
                    you would like to be reimbursed for. <br /> <br />
                    If you need a time extension on the deadline, please email
                    us at flymhacks@umich.edu. We have many other hackers on our
                    waitlist who would also need a travel reimbursement to
                    attend.
                </p>
            </div>
        );
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
                        You should have received a verification email at{' ' + userData.email}.
                        If not, you can request another one by clicking{' '}
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
        const { isEmailVerified, isAccepted, isConfirmed } = getUserMetadata(
            userData
        );

        if (!isEmailVerified) {
            return this.renderEmailVerificationPage();
        }

        return (
            <StyledPageContainer backgroundColor="red">
                <FullscreenColumnContainer>
                    <StyledDiv>
                        <ProfileSection userData={userData} />
                        <ApplicationSection userData={userData} />
                        {isAccepted && isConfirmed ? (
                            <div>
                                <Seperator />
                                <FaqItem
                                    header="Ticket"
                                    body={
                                        <span>{this.renderTicketInfo()}</span>
                                    }
                                />
                            </div>
                        ) : null}
                        <Seperator />
                        <FaqItem
                            header="Travel Information"
                            body={<span>{this.renderTravelInfo()}</span>}
                        />
                        <Seperator />
                        {userData.user.needs_reimbursement &&
                        userData.user.reimbursement > 0 ? (
                            <div>
                                <FaqItem
                                    header="Travel Reimbursement"
                                    body={
                                        <span>
                                            {this.renderTravelReimbursement()}
                                        </span>
                                    }
                                />
                                <Seperator />
                            </div>
                        ) : null}
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
