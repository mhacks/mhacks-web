import React from 'react';
import { SectionHeader, SectionBody } from './section_components.jsx';

class Schedule extends React.Component {
    render() {
        return (
            <div>
                <SectionHeader>Schedule (EST)</SectionHeader>
                <SectionBody>Monday, June 19th, 9pm - Nano Begins</SectionBody>
                <SectionBody>Thursday, June 22nd, 9pm - Nano Submissions Open</SectionBody>
                <SectionBody>Saturday, June 24th, 9pm - Nano Submissions Close</SectionBody>
                <SectionBody>Sunday, June 25th, 12am - Nano Voting Opens</SectionBody>
                <SectionBody>Tuesday, June 27th, 12am - Nano Voting Closes</SectionBody>
                <SectionBody>Wednesday, June 28th, 2pm - Nano Winners Announced</SectionBody>
            </div>
        );
    }
}

export default Schedule;
