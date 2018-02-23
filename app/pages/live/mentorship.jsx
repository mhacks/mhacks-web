import React from 'react';
import styled from 'styled-components';
import { MentorshipThunks } from '../../actions';
import { connect } from 'react-redux';
import { FormattedRelative } from 'react-intl';
import List from 'react-list';
import { MHForm, TabGroup, RoundedButton } from '../../components';
import { devices } from '../../styles';

import Components from './components.jsx';
const { SectionWrapper, SectionHeader } = Components;

const FormContainer = styled.div`
    width: 80%;
    margin: 0 auto;
`;

const ListItemHeader = styled.h2`
    color: ${props => props.theme.highlight};
    margin: 0;
    font-size: 20px;
    font-weight: bold;
`;

const ListItemSubheader = styled.p`
    color: white;
    margin: 0;
    font-size: 16px;
`;

const ListItemTimestamp = styled.p`
    font-weight: bold;
    margin-top: 7px;
    color: ${props => props.theme.highlight};
`;

const ListItemDescription = styled.p`
    color: white;
`;

const Seperator = styled.div`
    background: ${props => props.theme.highlight};
    height: 2px;
    margin: 15px 20px 15px 0;
`;

const TabGroupContainer = styled.div`
    width: 100%;
    margin: 0 auto 10px auto;

    ${devices.tablet`
        width: 80%;
    `};
`;

const selectedTabKeys = ['user', 'available', 'accepted'];

class Mentorship extends React.Component {
    constructor(props) {
        super(props);

        this.submitTicket = this.submitTicket.bind(this);
        this.acceptTicket = this.acceptTicket.bind(this);
        this.unacceptTicket = this.unacceptTicket.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.tabSelect = this.tabSelect.bind(this);

        this.state = {
            selectedTab: 0
        };
    }

    componentDidMount() {
        this.props.dispatch(MentorshipThunks.loadTickets());
        this.props.dispatch(MentorshipThunks.loadTicketForm());

        // refresh 20 seconds
        this.poll = setInterval(() => {
            this.props.dispatch(MentorshipThunks.loadTickets());
        }, 20 * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.poll);
    }

    submitTicket(ticket) {
        this.props.dispatch(MentorshipThunks.submitTicket(ticket));
    }

    acceptTicket(ticket) {
        this.props.dispatch(MentorshipThunks.acceptTicket(ticket));
    }

    unacceptTicket(ticket) {
        this.props.dispatch(MentorshipThunks.unacceptTicket(ticket));
    }

    completeTicket(ticket) {
        this.props.dispatch(MentorshipThunks.completeTicket(ticket));
    }

    tabSelect(idx) {
        this.setState({
            selectedTab: idx
        });
    }

    renderItem(index, key) {
        const isUserTickets = this.state.selectedTab === 0;
        const tickets = this.props.mentorshipState.data[
            selectedTabKeys[this.state.selectedTab]
        ];

        if (isUserTickets && index === 0) {
            // If there is no incomplete tickets, show form
            if (tickets.findIndex(ticket => !ticket.is_complete) === -1) {
                return (
                    <div key={key}>
                        <FormContainer>
                            <MHForm
                                schema={this.props.mentorshipState.data.form}
                                FieldTypes={
                                    this.props.mentorshipState.data.FieldTypes
                                }
                                theme={Object.assign({}, this.props.theme, {
                                    primary: this.props.theme.highlight,
                                    textColor: this.props.theme.highlight
                                })}
                                onSubmit={this.submitTicket}
                            />
                        </FormContainer>
                        <Seperator />
                    </div>
                );
            }

            return (
                <div key={key}>
                    <p style={{ color: 'white' }}>
                        You may only have one open ticket at a time! Complete
                        existing tickets before requesting a new one!
                    </p>
                    <Seperator />
                </div>
            );
        }

        if (isUserTickets) {
            index -= 1;
        }

        const isAccepted = this.state.selectedTab === 2;
        const ticket = tickets[index];
        const isComplete = ticket.is_complete;

        return (
            <div key={key}>
                <ListItemHeader theme={this.props.theme}>
                    {ticket.mentor !== undefined ? 'Accepted: ' : ''}
                    {ticket.title}
                </ListItemHeader>
                <ListItemTimestamp theme={this.props.theme}>
                    <FormattedRelative value={ticket.createdAt || new Date()} />
                </ListItemTimestamp>
                {isUserTickets ? null : (
                    <ListItemSubheader>
                        {ticket.requestor.full_name}: {ticket.requestor.email}
                    </ListItemSubheader>
                )}
                <ListItemDescription theme={this.props.theme}>
                    Description: {ticket.body}
                </ListItemDescription>
                <ListItemDescription theme={this.props.theme}>
                    Skills: {ticket.skills.join(', ')}
                </ListItemDescription>
                <ListItemDescription theme={this.props.theme}>
                    Location: {ticket.location_description}
                </ListItemDescription>
                {isUserTickets ? (
                    isComplete ? null : (
                        <RoundedButton
                            onClick={() => {
                                this.completeTicket(ticket, false);
                            }}
                            color={this.props.theme.highlight}
                        >
                            Complete
                        </RoundedButton>
                    )
                ) : isAccepted && !isComplete ? (
                    <RoundedButton
                        onClick={() => {
                            this.unacceptTicket(ticket, false);
                        }}
                        color={this.props.theme.highlight}
                    >
                        Unaccept
                    </RoundedButton>
                ) : (
                    <RoundedButton
                        onClick={() => {
                            this.acceptTicket(ticket);
                        }}
                        color={this.props.theme.highlight}
                    >
                        Accept
                    </RoundedButton>
                )}

                <Seperator />
            </div>
        );
    }

    render() {
        var length = this.props.mentorshipState.data[
            selectedTabKeys[this.state.selectedTab]
        ].length;

        // If selected tab is "User", add one to the length for the form
        if (
            this.state.selectedTab === 0 &&
            this.props.mentorshipState.data.form !== undefined
        ) {
            length += 1;
        }

        return (
            <SectionWrapper id="mentorship" theme={this.props.theme}>
                <SectionHeader>Mentorship</SectionHeader>
                <TabGroupContainer>
                    <TabGroup
                        defaultIndex={this.state.selectedTab}
                        tabs={[
                            {
                                title: 'User',
                                onClick: this.tabSelect
                            },
                            {
                                title: 'Available',
                                onClick: this.tabSelect
                            },
                            {
                                title: 'Accepted',
                                onClick: this.tabSelect
                            }
                        ]}
                        primaryColor={this.props.theme.highlight}
                    />
                </TabGroupContainer>
                <div style={{ overflow: 'auto', height: 'calc(100% - 100px)' }}>
                    <List
                        itemRenderer={this.renderItem}
                        length={length}
                        type="variable"
                        threshold={200}
                    />
                </div>
            </SectionWrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data,
        mentorshipState: state.mentorshipState
    };
}

export default connect(mapStateToProps)(Mentorship);
