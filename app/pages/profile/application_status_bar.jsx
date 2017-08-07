import React from 'react';
import styled from 'styled-components';

import { Theme } from '../../styles';
//import { getUserMetadata } from '../../util/user.js';
//import { Container } from '../components';
//import { devices } from '../styles';

const InfoContainer = styled.div`
    height: 15px;
    background: ${Theme.reverseBackgroundGradient};
    borderRadius: 25px;
    display: flex;
    borderStyle: solid;
    backgroundSize: ${props => props.percent}% 100%;
    backgroundRepeat: no-repeat;
`;

const VerticalLine = styled.div`
    background: black;
    height: 100%;
    width: 1px;
    marginLeft: calc(33% - 1px);
`;

class ApplicationStatusBar extends React.Component {
    render() {
        //const { userData } = this.props;
        //const { isApplicationSubmitted, isApplicationReviewed, isConfirmed } = getUserMetadata( userData );
        var isConfirmed = true;
        var isApplicationReviewed = true;
        var isApplicationSubmitted = true;

        var percent = '0';
        if (isConfirmed) {
            percent = '100';
        } else if (isApplicationReviewed) {
            percent = '66';
        } else if (isApplicationSubmitted) {
            percent = '33';
        }


        return (
            <div>
                <InfoContainer percent={percent}>
                    <VerticalLine />
                    <VerticalLine />
                </InfoContainer>
            </div>
        );
    }
}

export default ApplicationStatusBar;
