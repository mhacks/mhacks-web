import React from 'react';
import { SectionHeader, SectionBody } from './section_components.jsx';

class WhatIsMHacksNano extends React.Component {
    render() {
        return (
            <div>
                <SectionHeader>What's new with MHacks Nano?</SectionHeader>
                <SectionBody> MHacks Nano is our first ever online hackathon. Open to all students, Nano is your chance to start something new or continue working on that project you never quite had the time to finish and showcase it to the world. Form a team with up to three friends and use any and all resources at your disposal. The winners will be chosen by you, the hackers!</SectionBody>
            </div>
        );
    }
}

export default WhatIsMHacksNano;
