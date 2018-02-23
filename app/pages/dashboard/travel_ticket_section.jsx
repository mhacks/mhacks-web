import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getUserMetadata } from '../../util/user.js';
import ExpandingItem from './ExpandingItem';
import { endpoints } from '../../constants';

const AddToAppleWallet = require('../../../static/icons/add_to_apple_wallet.svg');

const FaqItem = props => (
    <ExpandingItem
        {...props}
        expandColor
        colorOn={props => props.theme.highlightSecondary}
        colorOff={props => props.theme.highlight}
    />
);

const Seperator = styled.div`
    background: ${props => props.theme.highlight};
    width: 100%;
    height: 2px;
    margin: 15px auto;
`;

const ImageWrapper = styled.div`
    text-align: center;
`;

const QRImage = styled.img`
    width: 80%;
    margin-top: 25px;
`;

const PassbookImage = styled.img`
    width: 40%;
    margin-top: 25px;
`;

class TravelTicketSection extends React.Component {
    renderTicketInfo() {
        return (
            <div>
                <p>
                    We will use this QR code during MHacks to register your
                    attendance, so be sure to save it or return to this page
                    during MHacks!
                </p>
                <ImageWrapper>
                    <QRImage src={endpoints.TICKET} width="100%" />
                    <a href={endpoints.TICKET_PASSBOOK}>
                        <PassbookImage src={AddToAppleWallet} />
                    </a>
                </ImageWrapper>
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

    renderAcceptedTravelReimbursement() {
        return (
            <div>
                <h4>
                    Travel Reimbursement Offered: Up to ${
                        this.props.userState.data.user.reimbursement
                    }
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

    renderDeclinedTravelReimbursement() {
        return (
            <p>
                Unfortunately we are unable to offer you a travel reimbursement
                to MHacks X. We hope you can still make it!
            </p>
        );
    }

    render() {
        const userData = this.props.userState.data;
        const { isAccepted, isConfirmed } = getUserMetadata(userData);
        const { reimbursement, needs_reimbursement } = userData.user;

        return (
            <div>
                {isAccepted ? (
                    <div>
                        {isConfirmed ? (
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
                        {reimbursement || needs_reimbursement ? (
                            <div>
                                <FaqItem
                                    header="Travel Reimbursement"
                                    body={
                                        reimbursement > 0 ? (
                                            <span>
                                                {this.renderAcceptedTravelReimbursement()}
                                            </span>
                                        ) : needs_reimbursement ? (
                                            <span>
                                                {this.renderDeclinedTravelReimbursement()}
                                            </span>
                                        ) : null
                                    }
                                />
                                <Seperator />
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(TravelTicketSection);
