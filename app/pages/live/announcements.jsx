import React from 'react';
import styled from 'styled-components';
import { FormattedRelative } from 'react-intl';
import { AnnouncementsThunks } from '../../actions';
import { connect } from 'react-redux';

const List = styled.div`
    display: flex;
    flex-direction: column;
`;

const ListItem = styled.div`
`;

const ListItemHeader = styled.h2`
    color: darkorange;
    margin: 0;
    fontSize: 24px;
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

        this.poll = setInterval(() => {
            this.props.dispatch(AnnouncementsThunks.loadAnnouncements());
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.poll);
    }

    render() {
        const announcements = this.props.announcementsState.data;

        return (
            <List>
                {announcements.map(function (announcement, i) {
                    return (
                        <ListItem key={i}>
                            <ListItemHeader>{announcement.title}</ListItemHeader>
                            <ListItemTimestamp><FormattedRelative value={announcement.broadcastTime} /></ListItemTimestamp>
                            <ListItemDescription>{announcement.body}</ListItemDescription>
                        </ListItem>
                    );
                })}
            </List>
        );
    }
}

function mapStateToProps(state) {
    return {
        announcementsState: state.announcementsState
    };
}

export default connect(mapStateToProps)(Announcements);
