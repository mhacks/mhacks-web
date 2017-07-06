import React from 'react';
import styled from 'styled-components';
import { FormattedRelative } from 'react-intl';
import { AnnouncementsThunks } from '../../actions';
import { connect } from 'react-redux';

const Wrapper = styled.div`
    height: 100%;
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    overflowY: scroll;
    height: calc(100% - 3 * 24px);
`;

const ListHeader = styled.h3`
    color: darkorange;
    fontSize: 24px;
    margin: 0 0 20px 0;
`;

const ListItem = styled.div`
`;

const ListItemHeader = styled.h2`
    color: darkorange;
    margin: 0;
    fontSize: 20px;
`;

const ListItemTimestamp = styled.p`
    fontWeight: bold;
    color: gray;
`;

const ListItemDescription = styled.p`
    color: gray;
`;

class Announcements extends React.Component {
    componentDidMount() {
        this.props.dispatch(AnnouncementsThunks.loadAnnouncements());

        // refresh announcements every 20 seconds
        this.poll = setInterval(() => {
            this.props.dispatch(AnnouncementsThunks.loadAnnouncements());
        }, 20 * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.poll);
    }

    render() {
        const announcements = this.props.announcementsState.data;

        return (
            <Wrapper>
                <ListHeader>Announcements</ListHeader>
                <List>
                    {announcements.map(function(announcement, i) {
                        return (
                            <ListItem key={i}>
                                <ListItemHeader>
                                    {announcement.title}
                                </ListItemHeader>
                                <ListItemTimestamp>
                                    <FormattedRelative
                                        value={announcement.broadcastTime}
                                    />
                                </ListItemTimestamp>
                                <ListItemDescription>
                                    {announcement.body}
                                </ListItemDescription>
                            </ListItem>
                        );
                    })}
                </List>
            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        announcementsState: state.announcementsState
    };
}

export default connect(mapStateToProps)(Announcements);
