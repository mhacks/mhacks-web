import React from 'react';
import styled from 'styled-components';

import { Theme } from '../../styles';
import { getUserMetadata } from '../../util/user.js';

const ProgressBar = styled.div`
    height: 15px;
    background: ${Theme.reverseBackgroundGradient};
    borderRadius: 25px;
    display: flex;
    borderStyle: solid;
    borderWidth: 1px;
    borderColor: white;
    backgroundSize: ${props => props.percent}% 100%;
    backgroundRepeat: no-repeat;
`;

const VerticalLine = styled.div`
    background: white;
    height: 100%;
    width: 1px;
    marginLeft: calc(33% - 1px);
`;

const Header = styled.h2`
    fontSize: 20px;
    color: ${props => props.theme.highlightSecondary};
    fontWeight: thin;
`;

const StatusText = styled.h2`
    fontSize: 20px;
    textTransform: uppercase;
    color: ${props => props.theme.highlightSecondary};
`;

const FlexBox = styled.div`
    display: flex;
    justifyContent: space-between;
    alignItems: center;
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
