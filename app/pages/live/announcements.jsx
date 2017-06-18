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
    }

    render() {
        return (
            <List>
                <ListItem>
                    <ListItemHeader>Header</ListItemHeader>
                    <ListItemTimestamp><FormattedRelative value={Date.now()} /></ListItemTimestamp>
                    <ListItemDescription>If you plan to ride on one of the two MHacks Buses to your school, please take all your belongings with you to closing ceremony - the buses will leave directly from the auditorium!</ListItemDescription>
                </ListItem>
                <ListItem>
                    <h2>Header</h2>
                    <p>If you plan to ride on one of the two MHacks Buses to your school, please take all your belongings with you to closing ceremony - the buses will leave directly from the auditorium!</p>
                </ListItem>
                <ListItem>
                    <h2>Header</h2>
                    <p>If you plan to ride on one of the two MHacks Buses to your school, please take all your belongings with you to closing ceremony - the buses will leave directly from the auditorium!</p>
                </ListItem>
                <ListItem>
                    <h2>Header</h2>
                    <p>If you plan to ride on one of the two MHacks Buses to your school, please take all your belongings with you to closing ceremony - the buses will leave directly from the auditorium!</p>
                </ListItem>
                <ListItem>
                    <h2>Header</h2>
                    <p>If you plan to ride on one of the two MHacks Buses to your school, please take all your belongings with you to closing ceremony - the buses will leave directly from the auditorium!</p>
                </ListItem>
                <ListItem>
                    <h2>Header</h2>
                    <p>If you plan to ride on one of the two MHacks Buses to your school, please take all your belongings with you to closing ceremony - the buses will leave directly from the auditorium!</p>
                </ListItem>
            </List>
        );
    }
}

function mapStateToProps(state) {
    return {
        userState: state.userState
    };
}

export default connect(mapStateToProps)(Announcements);
