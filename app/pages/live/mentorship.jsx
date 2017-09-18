import React from 'react';
import styled from 'styled-components';
import { MentorshipThunks } from '../../actions';
import { connect } from 'react-redux';
import { FormattedRelative } from 'react-intl';
import List from 'react-list';
import { TabGroup, RoundedButton } from '../../components';

import Components from './components.jsx';
const { SectionWrapper, SectionHeader } = Components;

const ListItemHeader = styled.h2`
    color: ${props => props.theme.highlight};
    margin: 0;
    fontSize: 20px;
    fontWeight: bold;
`;

const ListItemSubheader = styled.p`
    color: white;
    margin: 0;
    fontSize: 16px;
`;

const ListItemTimestamp = styled.p`
    fontWeight: bold;
    marginTop: 7px;
    color: ${props => props.theme.highlight};
`;

const ListItemDescription = styled.p`color: white;`;

const Seperator = styled.div`
    background: ${props => props.theme.highlight};
    height: 2px;
    margin: 15px 20px 15px 0;
`;

const TabGroupContainer = styled.div`
    width: 80%;
    margin: 0 auto 10px auto;
`;

class Mentorship extends React.Component {
    constructor(props) {
        super(props);

        this.acceptTicket = this.acceptTicket.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.tabSelect = this.tabSelect.bind(this);

        this.state = {
            selectedTab: 0
        };
    }

    componentDidMount() {
        this.props.dispatch(MentorshipThunks.loadTickets());

        // refresh 20 seconds
        this.poll = setInterval(() => {
            this.props.dispatch(MentorshipThunks.loadTickets());
        }, 20 * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.poll);
    }

    acceptTicket(ticket) {
        this.props.dispatch(MentorshipThunks.acceptTicket(ticket));
    }

    unacceptTicket(ticket) {
        this.props.dispatch(MentorshipThunks.unacceptTicket(ticket));
    }

    tabSelect(idx) {
        this.setState({
            selectedTab: idx
        });
    }

    renderItem(index, key) {
        const isAccepted = this.state.selectedTab === 1;
        const ticket = this.props.mentorshipState.data[
            isAccepted ? 'accepted' : 'available'
        ][index];
        const isComplete = ticket.is_complete;

        return (
            <div key={key}>
                <ListItemHeader theme={this.props.theme}>
                    {ticket.title}
                </ListItemHeader>
                <ListItemTimestamp theme={this.props.theme}>
                    <FormattedRelative value={ticket.createdAt} />
                </ListItemTimestamp>
                <ListItemSubheader>
                    {ticket.requestor.full_name}: {ticket.requestor.email}
                </ListItemSubheader>
                <ListItemDescription theme={this.props.theme}>
                    {ticket.body}
                </ListItemDescription>
                <ListItemDescription theme={this.props.theme}>
                    Skills: {ticket.skills}
                </ListItemDescription>
                <ListItemDescription theme={this.props.theme}>
                    Location: {ticket.location_description}
                </ListItemDescription>
                {isAccepted ? isComplete ? null : (
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
        const tickets = this.props.mentorshipState.data[
            this.state.selectedTab === 0 ? 'available' : 'accepted'
        ];

        return (
            <SectionWrapper theme={this.props.theme}>
                <SectionHeader>Mentorship</SectionHeader>
                <TabGroupContainer>
                    <TabGroup
                        defaultIndex={this.state.selectedTab}
                        tabs={[
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
                        length={tickets.length}
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
