import React from 'react';
import styled from 'styled-components';
import { FormattedRelative } from 'react-intl';
import { AnnouncementsThunks } from '../../actions';
import { connect } from 'react-redux';
import List from 'react-list';

import Components from './components.jsx';
const { SectionWrapper, SectionHeader } = Components;

const ListItemHeader = styled.h2`
    color: ${props => props.theme.highlight};
    margin: 0;
    font-size: 20px;
    font-weight: bold;
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

class Announcements extends React.Component {
    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

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

    renderItem(index, key) {
        const announcements = this.props.announcementsState.data;
        const announcement = announcements[index];

        return (
            <div key={key}>
                <ListItemHeader theme={this.props.theme}>
                    {announcement.title}
                </ListItemHeader>
                <ListItemTimestamp theme={this.props.theme}>
                    <FormattedRelative value={announcement.broadcastTime} />
                </ListItemTimestamp>
                <ListItemDescription theme={this.props.theme}>
                    {announcement.body}
                </ListItemDescription>
                <Seperator />
            </div>
        );
    }

    render() {
        const announcements = this.props.announcementsState.data;

        return (
            <SectionWrapper theme={this.props.theme}>
                <SectionHeader>Announcements</SectionHeader>
                <div style={{ overflow: 'auto', height: 'calc(100% - 44px)' }}>
                    <List
                        itemRenderer={this.renderItem}
                        length={announcements.length}
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
        announcementsState: state.announcementsState
    };
}

export default connect(mapStateToProps)(Announcements);
