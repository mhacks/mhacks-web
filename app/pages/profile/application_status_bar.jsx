import React from 'react';
import styled from 'styled-components';

import { Theme } from '../../styles';
import { getUserMetadata } from '../../util/user.js';
//import { Container } from '../components';
//import { devices } from '../styles';

const InfoContainer = styled.div`
    height: 15px;
    background: ${Theme.reverseBackgroundGradient};
    borderRadius: 25px;
    display: flex;
    borderStyle: solid;
    borderWidth: 1px;
    backgroundSize: ${props => props.percent}% 100%;
    backgroundRepeat: no-repeat;
`;

const VerticalLine = styled.div`
    background: black;
    height: 100%;
    width: 1px;
    marginLeft: calc(33% - 1px);
`;

const Header = styled.h2`
    fontSize: 20px;
    color: ${props => props.theme.highlight};
    fontWeight: thin;
`;

const StatusText = styled.h2`
    fontSize: 20px;
    textTransform: uppercase;
    fontWeight: 500;
    color: ${props => props.theme.highlight};
    //fontWeight: thin;
`;

const FlexBox = styled.div`
    display: flex;
    justifyContent: space-between;
    alignItems: center;
`;

class ApplicationStatusBar extends React.Component {
    render() {
        const userData = this.props.userData;
        const {
            isApplicationSubmitted,
            isApplicationReviewed,
            isConfirmed
        } = getUserMetadata(userData);
        //var isConfirmed = true;
        //var isApplicationReviewed = true;
        //var isApplicationSubmitted = true;
        var applicationStatus = 'Pending';
        var percent = '0';
        if (isConfirmed) {
            percent = '100';
            applicationStatus = 'Confirmed';
        } else if (isApplicationReviewed) {
            percent = '66';
            applicationStatus = 'Reviewed';
        } else if (isApplicationSubmitted) {
            percent = '33';
            applicationStatus = 'Submitted';
        }

        return (
            <div>
                <FlexBox>
                    <Header>Application Status</Header>
                    <StatusText>{applicationStatus}</StatusText>
                </FlexBox>
                <InfoContainer percent={percent}>
                    <VerticalLine />
                    <VerticalLine />
                </InfoContainer>
            </div>
        );
    }
}

export default ApplicationStatusBar;
