import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Container, ExpandingItem } from '../../components';
import { SectionHeader } from './section_components.jsx';
import { devices } from '../../styles';

const Wrapper = styled.div`
    background: ${props => props.theme.gradientOverlay}, ${props =>
    props.theme.primary}
    padding: 80px 0;
`;

const FaqSectionHeader = styled.div`
    font-size: 20px;
    color: ${props => props.theme.highlight};
    text-decoration: underline;
`;

const Section = styled.div`
    max-width: 90%;
    margin-top: 15px;
    margin-bottom: 10px;
    margin-left: 2%;
`;

const Link = styled.a`
    color: ${props => props.theme.highlight};
    text-decoration: none;
`;

const ExpandingItemWrapper = styled.div`
    margin-top: 5px;
`;

const FlexBox = styled.div`
    display: flex;
    flex-direction: column;

    ${devices.tablet`
        flex-direction: row;
    `};
`;

const FaqColumn = styled.div``;

const FaqBody = styled.div`
    max-width: 75%;
    margin: 30px auto 0;
`;

const FaqItem = props => (
    <ExpandingItemWrapper>
        <ExpandingItem
            {...props}
            expandColor
            colorOn={props => props.theme.highlightSecondary}
            colorOff={props => props.theme.highlight}
        />
    </ExpandingItemWrapper>
);

class Faq extends React.Component {
    render() {
        return (
            <Wrapper>
                <Container>
                    <SectionHeader>FAQ</SectionHeader>
                    <FlexBox>
                        <FaqColumn>
                            <FaqBody>
                                <FaqSectionHeader>General</FaqSectionHeader>
                                <Section>
                                    <FaqItem
                                        header="What happens at a hackathon?"
                                        body={
                                            <span>
                                                Participants
                                                (&#8220;hackers&#8221;) spend 36
                                                hours working in teams of 1 - 4
                                                people to build or code or
                                                design projects
                                                (&#8220;hacks&#8221;) that
                                                they&#8217;re excited about.
                                                There are workshops, mentors,
                                                food, swag, and buckets of
                                                coffee to guide you along the
                                                way. You bring your ideas, and
                                                we give you everything you need
                                                to make them come to life.
                                            </span>
                                        }
                                    />
                                    <FaqItem
                                        header="What do people normally make?"
                                        body={
                                            <span>
                                                Hacks generally fall under one
                                                (or more) of the seven cortices:
                                                Web Development, Android, iOS,
                                                AI/ML, AR/VR, Game Development,
                                                and Hardware. Check out the
                                                hacks from MHacks 9 on{' '}
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
                                        body="Nope! We&#8217;ll have lots of resources including workshops and a sweet mentorship system to help beginners
                                     get started. We will also dedicate one room to new hackers and have several project ideas to help you get started."
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
                                        header="How do I apply?"
                                        body="Step one is to create an MHacks Account and fill out some basic information in your MHacks Profile. Once that's done,
                                     you'll be able to apply for MHacks X! Note that if you're accepted to MHacks X, you will need to Confirm your acceptance."
                                    />
                                    <FaqItem
                                        header="When are applications closing?"
                                        body="Applications will be evaluated on a rolling basis until Monday, September 4th. Space fills up quickly, so apply early!
                                     &#10;To be eligible for a Travel Reimbursement, you will need to apply latest by Monday, August 14th, no exceptions will
                                      be made. You are eligible for a Travel Reimbursement if there are no MHacks Buses nearby your location and it costs you money
                                      to get to MHacks.&#10;"
                                    />
                                    <FaqItem
                                        header="How and when will I hear back?"
                                        body="We’ll be releasing decisions weekly on Mondays soon after the application opens."
                                    />
                                    <FaqItem
                                        header="Who can apply?"
                                        body="If you’re enrolled in a high school, college, or university, or if you left school during the current school year,
                                    you’re good to go! (Minors are welcome to apply, but will need to fill out a couple extra forms in order to attend.)"
                                    />
                                    <FaqItem
                                        header="Can we apply as a team?"
                                        body="Apply individually for now and include your teammates' emails in the 'anything else' question. We'll have a tool in the near future to get teams set up."
                                    />
                                    <FaqItem
                                        header="What if I’m a Michigan student?"
                                        body="Michigan students will need to apply and be accepted to be able to attend MHacks."
                                    />
                                    <FaqItem
                                        header="What are you looking for in an application?"
                                        body="Above anything else—passion. Tell us what you care about, what excites you. We want to know what’ll drive you to start and continue hacking. If there’s something about MHacks in particular that you’re excited about, we’d love to hear about that too!"
                                    />
                                    <FaqItem
                                        header="Are you allowing walk-ins?"
                                        body="We will not be allowing walk-ins. To ensure that you’ll be allowed in, please apply ahead of time."
                                    />
                                </Section>
                            </FaqBody>
                            <FaqBody>
                                <FaqSectionHeader>Hacking</FaqSectionHeader>
                                <Section>
                                    <FaqItem
                                        header="What if I don’t have a team or idea?"
                                        body="Not to worry, most people don’t! We have some great activities planned before and during the event to help you meet teammates and start thinking through your ideas."
                                    />
                                    <FaqItem
                                        header="What kind of hardware will there be?"
                                        body="There’ll be tons of cool hardware for you to hack on. We’ll put out a list closer to the event so you can see what’s available.
                                         You can also feel free to bring your own from home or email us with any suggestions."
                                    />
                                </Section>
                            </FaqBody>
                        </FaqColumn>

                        <FaqColumn>
                            <FaqBody>
                                <FaqSectionHeader>Logistics</FaqSectionHeader>
                                <Section>
                                    <FaqItem
                                        header="How will I get there from other schools?"
                                        body=" After you’ve applied and received word that you're coming to MHacks, we'll share information about buses and travel reimbursements.
                                        More than likely, we'll be sending a bus to a school near you. If you’re flying in, we’ll have shuttles from DTW as well.
                                        All bus schedules will be released closer to the event."
                                    />
                                    <FaqItem
                                        header="What if I’m an international student?"
                                        body={
                                            <span>
                                                If you go to school in Canada,
                                                we may be sending a bus to your
                                                university or one near you. If
                                                you are traveling from another
                                                country, the first step is to
                                                make sure you have a valid
                                                travel visa. Please refer to{' '}
                                                <Link
                                                    href="https://www.visahq.com"
                                                    target="_blank"
                                                >
                                                    this website
                                                </Link>{' '}
                                                to make sure you meet the
                                                requirements and get started on
                                                the process if you haven’t
                                                already. If you need anything
                                                from the organizers, such as a
                                                letter of invitation, please
                                                contact us as soon as possible
                                                at{' '}
                                                <Link href="mailto:hackathon@umich.edu">
                                                    hackathon@umich.edu
                                                </Link>.
                                            </span>
                                        }
                                    />
                                    <FaqItem
                                        header="Will you be offering travel reimbursements?"
                                        body="We can’t guarantee reimbursements for everyone, but we don’t want money to keep you from experiencing MHacks. You’ll get a reimbursement amount along with your invitation. Let us know if you still need help making your way to Ann Arbor and we’ll see what we can do."
                                    />
                                    <FaqItem
                                        header="Will there be parking available?"
                                        body="Parking will be available first-come first-serve in very limited quantities at nearby University of Michigan parking lots."
                                    />
                                    <FaqItem
                                        header="What should I bring?"
                                        body="You should bring your student ID and anything you’d need for a sleepover: laptop, charger, deodorant (!), change of clothes, etc.. You won’t need food or drinks; we’ve got you covered there."
                                    />
                                    <FaqItem
                                        header="What shouldn’t I bring?"
                                        body="Weapons of any kind, drugs, or alcohol. If you’re not sure whether something will be okay, please ask ahead of time!"
                                    />
                                </Section>
                            </FaqBody>

                            <FaqBody>
                                <FaqSectionHeader>Help!</FaqSectionHeader>
                                <Section>
                                    <FaqItem
                                        header="I don’t want to hack, I want to ________!"
                                        body={
                                            <span>
                                                If you’re contemplating judging,
                                                volunteering, or mentoring,
                                                shoot us an email at{' '}
                                                <Link href="mailto:hackathon@umich.edu">
                                                    hackathon@umich.edu
                                                </Link>. If your company is
                                                interested in becoming a
                                                sponsor, check out the
                                                sponsorship section below.
                                            </span>
                                        }
                                    />
                                    <FaqItem
                                        header="I didn’t find my question here..."
                                        body={
                                            <span>
                                                If you’ve got something else on
                                                your mind, fire it off to{' '}
                                                <Link href="mailto:hackathon@umich.edu">
                                                    hackathon@umich.edu
                                                </Link>!
                                            </span>
                                        }
                                    />
                                </Section>
                            </FaqBody>
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
