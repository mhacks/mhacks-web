import React from 'react';
import styled from 'styled-components';
import { SectionHeader } from './section_components.jsx';

const RulesSectionHeader = styled.h2`
    fontSize: 20px;
    color: darkorange;
    marginTop: 6px;
    marginBottom: 6px;
`;

const RulesSectionBody = styled.p`
    paddingLeft: 25px;
    -webkit-margin-before: 5px;
    -webkit-margin-after: 5px;
    color: gray;
    fontSize: 17px;
`;

class Rules extends React.Component {
    render() {
        return (
            <div>
                <SectionHeader>Rules</SectionHeader>
                <RulesSectionHeader>General</RulesSectionHeader>
                <RulesSectionBody>
                    Any student is eligible to participate in MHacks Nano.
                </RulesSectionBody>

                <RulesSectionHeader>Hacking</RulesSectionHeader>
                <RulesSectionBody>
                    Teams may not have more than four members.
                </RulesSectionBody>
                <RulesSectionBody>
                    You are welcome to build off of pre-existing content, but only work you complete during the 120 hour Hacking period of MHacks Nano is eligible for your MHacks Nano submission.
                </RulesSectionBody>

                <RulesSectionHeader>Voting</RulesSectionHeader>
                <RulesSectionBody>
                    Please base your vote only on content that was created during MHacks Nano to ensure an even playing field.
                </RulesSectionBody>
                <RulesSectionBody>
                    You must vote on at least five Hacks to be eligible to win.
                </RulesSectionBody>
                <RulesSectionBody>
                    Do not attempt to abuse the voting system - we will be monitoring suspicious behavior and will disqualify those who try to gain an unfair advantage.
                </RulesSectionBody>
            </div>
        )
    }
}

export default Rules;
