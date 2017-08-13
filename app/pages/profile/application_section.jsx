import React from 'react';
import ApplicationStatusBar from './application_status_bar.jsx';
import styled from 'styled-components';

const SectionHeader = styled.h2`
    fontSize: 25px;
    color: ${props => props.theme.highlight};
    textTransform: uppercase;
`;

const SectionBody = styled.p`
    color: ${props => props.theme.highlight};
    fontSize: 16px;
    max-width: 600px;
`;

class ApplicationSection extends React.Component {
    render() {
        return (
            <div>
                <SectionHeader>Application</SectionHeader>
                <ApplicationStatusBar userData={this.props.userData} />
                <SectionBody>
                    We're excited to see you at MHacks X! We've got some great
                    things in store :) In the meantime, we encourage you to
                    connect with other hackers in the HH MHacks Facebook Grouop.
                    As always, stay tuned to our Facebook, Twitter, and
                    Instagram for updates on all things MHacks.
                </SectionBody>
            </div>
        );
    }
}

export default ApplicationSection;
