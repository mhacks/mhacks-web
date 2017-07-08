import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Container, ExpandingItem } from '../../components';
import { SectionHeader } from './section_components.jsx';

const Wrapper = styled.div`
    background: ${props => props.theme.gradientOverlay}, ${props =>
    props.theme.primary}
    padding: 80px 0;
`;

const FaqSectionHeader = styled.div`
    display: inline;
    fontSize: 20px;
    color: darkorange;
    text-decoration: underline;
    marginTop: 6px;
    marginBottom: 6px;
`;

const Section = styled.div`
    maxWidth: 90%;
    marginBottom: 10px;
    marginLeft: 2%;
`;

const Link = styled.a`
    color: ${props => props.theme.teal};
    textDecoration: none;
`;

const ExpandingItemWrapper = styled.div`
    marginTop: 20px;
    
`;

const FlexBox = styled.div`
    display: flex;
    flexDirection: row;
`;

const FaqColumn = styled.div`
    display: flex;
    flexDirection: column;
    alignItems: center;
    flex-grow: 1;
    flex-basis: 0;
`;
const FaqBody = styled.div`
     max-width: 75%;
    
`;
const FaqItem = (props => (
    <ExpandingItemWrapper>
        <ExpandingItem
            {...props}
            expandColor
            colorOn="darkorange"
            colorOff="gray"
        />
    </ExpandingItemWrapper>;

class Faq extends React.Component {
    render() {
        return (
            <Wrapper>
                <Container>
                    <SectionHeader>FAQ</SectionHeader>
                    <FaqSectionHeader>General</FaqSectionHeader>
                    <Section>
                        <FaqItem
                            header="What happens at a hackathon?"
                            body={
                                <span>
                                    Participants ("hackers") work in teams of
                                    1-4 people to make something (a&nbsp;"hack")
                                    they're excited about. We'll have tons of
                                    online resources to help you along the way.
                                </span>
                            }
                        />
                        <FaqItem
                            header="What do people normally make?"
                            body={
                                <span>
                                    Common areas of focus include iOS or Android
                                    apps, web apps,
                                    and hardware hacks. Check out the hacks from
                                    MHacks 9 on &nbsp;
                                    <Link
                                        href="https://mhacks9.devpost.com/submissions"
                                        target="_blank"
                                    >
                                        Devpost.
                                    </Link>
                                </span>
                            }
                        />
                        <FaqItem
                            header="Do I have to know how to code to attend?"
                            body="Nope! We'll have links to lots of online resources to help you get started or
                                    find your way if you get lost. Moreover, your hack doesn't necessarily have
                                    to include coding."
                        />
                        <FaqItem
                            header="Who runs MHacks?"
                            body="MHacks is run by a group of dedicated and passionate young people,
                                    most of whom are students at the University of Michigan."
                        />
                    </Section>
                    <FaqSectionHeader>Application</FaqSectionHeader>
                    <Section>
                        <FaqItem
                            header="Who can apply?"
                            body="MHacks Nano is open to any and all students."
                        />
                        <FaqItem
                            header="When are applications closing?"
                            body="Applications for MHacks Nano will remain open until the hacking period ends
                                 (Saturday, June 24th at 9pm Eastern Time)."
                        />
                        <FaqItem
                            header="How and when will I hear back?"
                            body="If you've applied, you're accepted!"
                        />
                        <FaqItem
                            header="Can we apply as a team?"
                            body="You can form a team when submitting your hack."
                        />
                    </Section>
                    <FaqSectionHeader>Hacking</FaqSectionHeader>
                    <Section>
                        <FaqItem
                            header="What if I don’t have a team or idea?"
                            body={
                                <span>
                                    Not to worry, most people don't! Check out
                                    the
                                    <Link
                                        href="https://www.facebook.com/groups/1900638676819691/?ref=br_rs"
                                        target="_blank"
                                    >
                                        {' '}MHacks&nbsp;Nano&nbsp;Facebook&nbsp;Event{' '}
                                    </Link>
                                    to get started!
                                </span>
                            }
                        />
                    </Section>
                    <FaqSectionHeader>Voting</FaqSectionHeader>
                    <Section>
                        <FaqItem
                            header="How does voting work?"
                            body="You'll be able to upvote hacks that impress you and downvote hacks that you don't
                                    think met the bar. The more hacks you vote on, the more likely your hack is to get votes.
                                    Please be respectful to your fellow hackers and vote honestly."
                        />
                    </Section>
                    <FaqSectionHeader>Help!</FaqSectionHeader>
                    <Section>
                        <FaqItem
                            header="I didn't find my question here..."
                            body="If you’ve got something else on your mind, fire it off to hackathon@umich.edu!"
                        />
                    </Section>
                <SectionHeader>FAQ</SectionHeader>
                <FlexBox>
                <FaqColumn>
                    <FaqBody>
                        <FaqSectionHeader>General</FaqSectionHeader>
                            <Section>
                                <FaqItem
                                    header="What happens at a hackathon?"
                                    body={<span>Participants ("hackers") work in teams of 1-4 people to make something (a&nbsp;"hack")
                                        they're excited about. We'll have tons of online resources to help you along the way.
                                        </span>}
                                />
                                <FaqItem
                                    header="What do people normally make?"
                                    body={<span>Common areas of focus include iOS or Android apps, web apps,
                                            and hardware hacks. Check out the hacks from MHacks 9 on &nbsp;
                                            <Link href="https://mhacks9.devpost.com/submissions" target="_blank">Devpost.</Link>
                                        </span>}
                                />
                                <FaqItem
                                    header="Do I have to know how to code to attend?"
                                    body="Nope! We'll have links to lots of online resources to help you get started or
                                        find your way if you get lost. Moreover, your hack doesn't necessarily have
                                        to include coding."
                                />
                                <FaqItem
                                    header="Who runs MHacks?"
                                    body="MHacks is run by a group of dedicated and passionate young people,
                                        most of whom are students at the University of Michigan."
                                />
                            </Section>
                    </FaqBody>
                    <FaqBody>
                        <FaqSectionHeader>Application</FaqSectionHeader>
                            <Section>
                                <FaqItem
                                    header="Who can apply?"
                                    body="MHacks Nano is open to any and all students."
                                />
                                <FaqItem
                                    header="When are applications closing?"
                                    body="Applications for MHacks Nano will remain open until the hacking period ends
                                     (Saturday, June 24th at 9pm Eastern Time)."
                                />
                                <FaqItem
                                    header="How and when will I hear back?"
                                    body="If you've applied, you're accepted!"
                                />
                                <FaqItem
                                    header="Can we apply as a team?"
                                    body="You can form a team when submitting your hack."
                                />
                            </Section>
                    </FaqBody>
                    </FaqColumn>

                    <FaqColumn>
                        <FaqBody>
                        <FaqSectionHeader>Hacking</FaqSectionHeader>
                        <Section>
                            <FaqItem
                                header="What if I don’t have a team or idea?"
                                body={<span>Not to worry, most people don't! Check out the
                                        <Link href="https://www.facebook.com/groups/1900638676819691/?ref=br_rs" target="_blank"> MHacks&nbsp;Nano&nbsp;Facebook&nbsp;Event </Link>
                                         to get started!
                                    </span>}
                            />
                            <FaqItem
                                header="What kind of hardware will there be?"
                                body={<span>Not to worry, most people don't! Check out the
                                        <Link href="https://www.facebook.com/groups/1900638676819691/?ref=br_rs" target="_blank"> MHacks&nbsp;Nano&nbsp;Facebook&nbsp;Event </Link>
                                         to get started!
                                    </span>}
                            />
                            <FaqItem
                                header="How will I get there from other schools?"
                                body={<span>Not to worry, most people don't! Check out the
                                        <Link href="https://www.facebook.com/groups/1900638676819691/?ref=br_rs" target="_blank"> MHacks&nbsp;Nano&nbsp;Facebook&nbsp;Event </Link>
                                         to get started!
                                    </span>}
                            />
                            <FaqItem
                                header="Will you be offering travel reimbursements?"
                                body={<span>Not to worry, most people don't! Check out the
                                        <Link href="https://www.facebook.com/groups/1900638676819691/?ref=br_rs" target="_blank"> MHacks&nbsp;Nano&nbsp;Facebook&nbsp;Event </Link>
                                         to get started!
                                    </span>}
                            />
                            <FaqItem
                                header="What shouldn't I bring?"
                                body={<span>Not to worry, most people don't! Check out the
                                        <Link href="https://www.facebook.com/groups/1900638676819691/?ref=br_rs" target="_blank"> MHacks&nbsp;Nano&nbsp;Facebook&nbsp;Event </Link>
                                         to get started!
                                    </span>}
                            />
                            <FaqItem
                                header="Will if I'm an international student?"
                                body={<span>Not to worry, most people don't! Check out the
                                        <Link href="https://www.facebook.com/groups/1900638676819691/?ref=br_rs" target="_blank"> MHacks&nbsp;Nano&nbsp;Facebook&nbsp;Event </Link>
                                         to get started!
                                    </span>}
                            />
                            <FaqItem
                                header="What should I bring?"
                                body={<span>Not to worry, most people don't! Check out the
                                        <Link href="https://www.facebook.com/groups/1900638676819691/?ref=br_rs" target="_blank"> MHacks&nbsp;Nano&nbsp;Facebook&nbsp;Event </Link>
                                         to get started!
                                    </span>}
                            />
                        </Section>
                        </FaqBody>

                        <FaqBody>
                        <FaqSectionHeader>Help!</FaqSectionHeader>
                        <Section>
                            <FaqItem
                                header="I didn't find my question here..."
                                body="If you’ve got something else on your mind, fire it off to hackathon@umich.edu!"
                            />
                        </Section>
                        </ FaqBody>
                    </FaqColumn>
                    </FlexBox>
                </Container>
                </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Faq);
