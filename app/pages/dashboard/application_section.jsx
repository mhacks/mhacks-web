import React from 'react';
import ApplicationStatusBar from './application_status_bar.jsx';
import { SectionHeader, SectionBody } from './section_components.jsx';

class ApplicationSection extends React.Component {
    render() {
        return (
            <div>
                <SectionHeader>Application</SectionHeader>
                <ApplicationStatusBar userData={this.props.userData} />
                <SectionBody>
                    We're excited to see you at MHacks X! We've got some great
                    things in store :) In the meantime, we encourage you to
                    connect with other hackers in the HH MHacks Facebook Group.
                    As always, stay tuned to our Facebook, Twitter, and
                    Instagram for updates on all things MHacks.
                </SectionBody>
            </div>
        );
    }
}

export default ApplicationSection;
