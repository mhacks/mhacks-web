import React from 'react';
import styled from 'styled-components';

import { Theme } from '../../styles';
import { getUserMetadata } from '../../util/user.js';

const ProgressBar = styled.div`
    height: 15px;
    background: ${Theme.reverseBackgroundGradient};
    border-radius: 25px;
    display: flex;
    border-style: solid;
    border-width: 1px;
    border-color: white;
    background-size: ${props => props.percent}% 100%;
    background-repeat: no-repeat;
`;

const VerticalLine = styled.div`
    background: white;
    height: 100%;
    width: 1px;
    margin-left: calc(33% - 1px);
`;

const Header = styled.h2`
    font-size: 20px;
    color: ${props => props.theme.highlightSecondary};
    font-weight: thin;
`;

const StatusText = styled.h2`
    font-size: 20px;
    text-transform: uppercase;
    color: ${props => props.theme.highlightSecondary};
`;

const FlexBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

class ApplicationStatusBar extends React.Component {
    render() {
        var applicationStatus, percent;
        const userData = this.props.userData;
        const {
            isApplicationSubmitted,
            isAccepted,
            isWaitlisted,
            isConfirmed
        } = getUserMetadata(userData);

        if (isConfirmed) {
            applicationStatus = 'Confirmed';
            percent = '100';
        } else if (isWaitlisted) {
            applicationStatus = 'Waitlisted';
            percent = '66';
        } else if (isAccepted) {
            applicationStatus = 'Accepted';
            percent = '66';
        } else if (isApplicationSubmitted) {
            applicationStatus = 'Submitted';
            percent = '33';
        } else {
            applicationStatus = 'Not Submitted';
            percent = '0';
        }

        return (
            <div>
                <FlexBox>
                    <Header>Application Status</Header>
                    <StatusText>{applicationStatus}</StatusText>
                </FlexBox>
                <ProgressBar percent={percent}>
                    <VerticalLine />
                    <VerticalLine />
                </ProgressBar>
            </div>
        );
    }
}

export default ApplicationStatusBar;
