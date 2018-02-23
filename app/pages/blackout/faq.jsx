import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SectionHeader } from './section_components.jsx';
import { ExpandingItem, Container } from '../../components';
import { devices } from '../../styles';

const Wrapper = styled.div`
    padding: 75px 0;
    position: relative;
`;

const Header = styled(SectionHeader)`
    text-align: center;
`;

const FaqSectionHeader = styled.h2`
    font-size: 18px;
    text-transform: uppercase;
    margin-top: 30px;
    margin-bottom: 5px;
    color: ${props => props.theme.pink};
`;

const Section = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const ExpandingItemWrapper = styled.div`
    display: inline-block;
    position: relative;
    padding-right: 30px;
    clear: both;
    width: 100%;

    ${devices.tablet`
        width: 50%;
    `} ${devices.giant`
        width: 33%;
    `};
`;

const Link = styled.a`
    color: ${props => props.theme.teal};
    text-decoration: none;
`;

const FaqItem = connect(state => {
    return { theme: state.theme.data };
})(props => (
    <ExpandingItemWrapper>
        <ExpandingItem
            {...props}
            plusColor={props.theme.pink}
            headerColor="white"
            bodyColor={props.theme.pink}
        />
    </ExpandingItemWrapper>
));

class BlackoutFaq extends React.Component {
    render() {
        return (
            <Container>
                <Wrapper>
                    <Header>Frequently Asked Questions</Header>
                    <FaqSectionHeader>General</FaqSectionHeader>
                    <Section>
                        <FaqItem
                            header="What happens at a hackathon?"
                            body={
                                <span>
                                    Participants (“hackers”) spend 36 hours
                                    working in teams of 1 - 4 people to build or
                                    code projects (“hacks”) they’re excited
                                    about. There are workshops, mentors, food,
                                    swag, and buckets of coffee to guide you
                                    along the way. You bring your ideas, and we
                                    give you everything you need to make them
                                    come to life. &nbsp;
                                    <Link
                                        href="https://drive.google.com/file/d/0B4fSxuPetYFGWjNLSng1QVdVdm8/view"
                                        target="_blank"
                                    >
                                        Past Schedule
                                    </Link>
                                </span>
                            }
                        />
                        <FaqItem
                            header="What do people normally make?"
                            body={
                                <span>
                                    Common areas of focus include iOS or Android
                                    apps, web apps, and hardware hacks. Check
                                    out the hacks from MHacks 9 on &nbsp;
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
                            body="Nope! We’ll have lots of resources — including workshops and a sweet,
                                new mentorship system — to help beginners get started. For this MHacks,
                                we will also dedicate one room to new hackers and have several project
                                ideas to help you get started."
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
                            body="If you’re enrolled in a high school, college, or university,
                                or if you left school during the current school year, you’re good to go!
                                (Minors are welcome to apply, but will need to fill out a couple extra forms
                                in order to attend.)"
                        />
                        <FaqItem
                            header="Can we apply as a team?"
                            body="You and your intended teammates should all apply individually. But if you
                                get an invitation and some of your teammates don’t, shoot us an email at
                                hackathon@umich.edu and we’ll try to sort things out."
                        />
                        <FaqItem
                            header="What are you looking for in an application?"
                            body="Above anything else: passion. Tell us what you care about — what excites you.
                                We want to know what’ll drive you to start and continue hacking.
                                If there’s something about MHacks in particular that you’re excited about,
                                we’d love to hear about that too!"
                        />
                    </Section>
                    <FaqSectionHeader>Hacking</FaqSectionHeader>
                    <Section>
                        <FaqItem
                            header="What if I don’t have a team or idea?"
                            body="Not to worry, most people don’t! We have some great activities planned
                                before and during the event to help you meet teammates and start thinking
                                through your ideas."
                        />
                        <FaqItem
                            header="What kind of hardware will there be?"
                            body="There’ll be tons of cool hardware for you to hack on! We’ll put out a list
                                closer to the event so you can see what’s available. You can also feel free to
                                bring your own from home or email us with any suggestions!"
                        />
                    </Section>
                    <FaqSectionHeader>Logistics</FaqSectionHeader>
                    <Section>
                        <FaqItem
                            header="How will I get there from other schools?"
                            body="After you’ve applied and received word that you're coming to MHacks,
                                we'll share information about buses and travel reimbursements. More than likely,
                                we'll be sending a bus to a school near you. If you’re flying in, we’ll have shuttles
                                from DTW as well. All bus schedules will be released closer to the event."
                        />
                        <FaqItem
                            header="What if I'm an International Student?"
                            body="If you go to school in Canada, we may be sending a bus to your university or one
                                near you. If you are traveling from another country, the first step is to make
                                sure you have a valid travel Visa. Please refer to this website to make sure you meet
                                the requirements and get started on the process if you haven’t already. If you need
                                anything from the organizers, such as a letter of invitation, please contact us as
                                soon as possible at hackathon@umich.edu."
                        />
                        <FaqItem
                            header="Will you be offering travel reimbursements?"
                            body="We can’t guarantee reimbursements for everyone, but we don’t want money to
                                keep you from experiencing MHacks. You’ll get a reimbursement amount along with
                                your invitation. Let us know if you still need help making your way to Detroit
                                and we’ll see what we can do."
                        />
                        <FaqItem
                            header="What should I bring?"
                            body="You should bring your student ID and anything you’d need for a productive
                                and healthy weekend: laptop, charger, deodorant (!), change of clothes, etc.
                                You won’t need food or drinks; we’ve got you covered there. :)"
                        />
                        <FaqItem
                            header="What shouldn't I bring?"
                            body="Weapons of any kind, drugs, or alcohol. If you’re not sure whether
                                something will be okay, please ask ahead of time!"
                        />
                    </Section>
                    <FaqSectionHeader>Help!</FaqSectionHeader>
                    <Section>
                        <FaqItem
                            header="I don’t want to hack, I want to ________!"
                            body="If you’re contemplating judging, volunteering, or mentoring, shoot us an email
                                at hackathon@umich.edu. If your company is interested in becoming a sponsor,
                                check out the sponsorship section below."
                        />
                        <FaqItem
                            header="I didn't find my question here..."
                            body="If you’ve got something else on your mind, fire it off to hackathon@umich.edu!"
                        />
                    </Section>
                </Wrapper>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(BlackoutFaq);
