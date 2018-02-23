import React from 'react';
import styled from 'styled-components';
import ApplicationStatusBar from './application_status_bar.jsx';
import { getUserMetadata } from '../../util/user.js';
import { SectionHeader, SectionBody } from './section_components.jsx';
import { routes } from '../../constants';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

const StyledNavLink = styled(NavLink)`
    font-size: 16px;
    padding: 2px 20px;
    border: 2px solid ${props => props.theme.highlight};
    color: ${props => props.theme.highlight};
    border-radius: 25px;
    text-decoration: none;
    transition: all 0.3s;
    text-transform: uppercase;

    &:hover {
        background-color: ${props => props.theme.highlight};
        color: white;
    }
`;

const Link = styled.a`
    color: ${props => props.theme.highlightSecondary};
    cursor: pointer;
`;

class ApplicationSection extends React.Component {
    renderApplicationReviewSection() {
        const userData = this.props.userState.data;
        const {
            isApplicationSubmitted,
            isWaitlisted,
            isAccepted,
            isConfirmed
        } = getUserMetadata(userData);

        if (isConfirmed) {
            return this.renderConfirmed();
        } else if (isAccepted) {
            return this.renderAcceptance();
        } else if (isWaitlisted) {
            return this.renderWaitlisted();
        } else if (isApplicationSubmitted) {
            return this.renderSubmitted();
        } else {
            return this.renderNotSubmitted();
        }
    }

    renderAcceptance() {
        return (
            <div>
                <SectionBody>
                    You’re awesome. We’re awesome. Let’s make some great things
                    together. Head over to the confirmation form to secure your
                    spot at MHacks X!
                </SectionBody>
                <StyledNavLink to={routes.CONFIRM}>Confirm</StyledNavLink>
            </div>
        );
    }

    renderConfirmed() {
        return (
            <SectionBody>
                We’re excited to see you at MHacks X! We’ve got some great
                things in store :) In the meantime, we encourage you to connect
                with other hackers in the{' '}
                <Link
                    target="_blank"
                    href="https://www.facebook.com/groups/1506039289667163/"
                >
                    HH MHacks Facebook Group
                </Link>, and the{' '}
                <Link
                    target="_blank"
                    href="https://www.facebook.com/events/363750477376350/"
                >
                    MHacks X Facebook Event
                </Link>
                . As always,stay tuned to our{' '}
                <Link
                    target="_blank"
                    href="http://facebook.com/MHacksHackathon"
                >
                    Facebook
                </Link>,{' '}
                <Link target="_blank" href="http://twitter.com/mhacks">
                    Twitter
                </Link>, and{' '}
                <Link href="http://instagram.com/mhacks_">Instagram</Link> for
                updates on all things MHacks.
            </SectionBody>
        );
    }

    renderWaitlisted() {
        return (
            <SectionBody>
                Unfortunately, we are unable to extend an invitation for MHacks
                X to you at this time. We hope you will still be a part of our
                community via{' '}
                <Link
                    target="_blank"
                    href="http://facebook.com/MHacksHackathon"
                >
                    Facebook
                </Link>,{' '}
                <Link target="_blank" href="http://twitter.com/mhacks">
                    Twitter
                </Link>,{' '}
                <Link target="_blank" href="http://instagram.com/mhacks_">
                    Instagram
                </Link>, and and encourage you to apply for the next MHacks
                event in the winter.
            </SectionBody>
        );
    }

    renderSubmitted() {
        return (
            <SectionBody>
                Your application is submitted but you can make changes on the
                hacker application page! Thanks for applying to MHacks X.
            </SectionBody>
        );
    }

    renderNotSubmitted() {
        return (
            <div>
                <SectionBody>
                    Head on over to the application section to apply!
                </SectionBody>
                <StyledNavLink to={routes.APPLY}>Apply</StyledNavLink>
            </div>
        );
    }

    render() {
        return (
            <div>
                <SectionHeader>Application</SectionHeader>
                <ApplicationStatusBar userData={this.props.userData} />
                {this.renderApplicationReviewSection()}
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

export default connect(mapStateToProps)(ApplicationSection);
