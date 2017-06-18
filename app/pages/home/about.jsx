import React from 'react';
import { SectionHeader, SectionBody } from './section_components.jsx';

class About extends React.Component {
    render() {
        return (
            <div>
                <SectionHeader>About MHacks</SectionHeader>
                <SectionBody>MHacks is a group of University of Michigan students who want to help you turn  your ideas into reality. We're best known for the 36-hour hackathons we run twice a year.  You're welcome to come with or without a team. We'll provide you with all the resources and  mentors you need to help you work on something cool or learn new skills. You'll have the freedom  to create a product, learn new techniques for your future work, or just have fun working on a project with friends. Moreover, we will offer you a chance to network with other creators and professionals. For newcomers and veterans alike, MHacks events are experiences you won’t want to miss.</SectionBody>
            </div>
        );
    }
}

export default About;
