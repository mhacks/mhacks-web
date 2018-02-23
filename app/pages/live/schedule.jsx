import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Calendar from 'react-big-calendar';
import moment from 'moment';

import { devices } from '../../styles';
import { EventsThunks } from '../../actions';
import { TabGroup } from '../../components';

const TabGroupContainer = styled.div`
    width: 100%;
    margin: 0 auto 10px auto;

    ${devices.tablet`
        width: 80%;
    `};
`;

const Wrapper = styled.div`
    height: 100%;
    border-radius: 20px;
    padding: 20px;
    background: ${props => props.theme.generateBackgroundGradient(45, 0.2)};
`;

const ListHeader = styled.h3`
    color: ${props => props.theme.highlight};
    text-align: center;
    text-transform: uppercase;
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 20px 0;
`;

const CalendarContainer = styled.div`
    height: calc(100% - 107px);

    .rbc-today {
        background-color: transparent;
    }

    .rbc-time-header {
        display: none;
    }

    .rbc-day-slot .rbc-time-slot {
        border-top: none;
    }

    .rbc-time-view {
        border: none;
    }

    .rbc-time-content {
        border: none;
    }

    .rbc-time-content > * + * > * {
        border-left: none;
    }

    .rbc-timeslot-group {
        border-bottom: 1px solid ${props => props.theme.highlight};
    }

    .rbc-time-slot.rbc-label {
        color: ${props => props.theme.highlight};
    }

    .rbc-current-time-indicator {
        display: none;
    }

    .rbc-day-slot .rbc-event {
        &:hover {
            z-index: 999;
            height: 100px !important;
        }
    }
`;

function Event({ event }) {
    return (
        <span>
            <strong>{event.name}</strong>
            {event.desc && ':  ' + event.desc}
        </span>
    );
}

Calendar.momentLocalizer(moment);

class Schedule extends React.Component {
    constructor(props) {
        super(props);

        this.props.dispatch(EventsThunks.loadEvents());

        this.tabSelect = this.tabSelect.bind(this);

        const startDate = new Date(
            props.configurationState.data.start_date
        ).getTime();
        const endDate = new Date(
            props.configurationState.data.end_date
        ).getTime();
        const currentDate = new Date().getTime();

        var idx = 0;

        if (currentDate < startDate) {
            idx = 0;
        } else if (currentDate > endDate) {
            idx = 2;
        } else {
            idx = 1;
        }

        this.state = {
            selectedDate: new Date(startDate + (idx - 1) * 1000 * 60 * 60 * 24),
            initialDateIndex: idx
        };
    }

    tabSelect(idx) {
        const startDate = new Date(
            this.props.configurationState.data.start_date
        ).getTime();

        this.setState({
            selectedDate: new Date(startDate + (idx - 1) * 1000 * 60 * 60 * 24)
        });
    }

    render() {
        const events = this.props.eventsState.data.map(event => {
            return Object.assign({}, event, {
                startDate: new Date(event.startDate),
                endDate: new Date(event.endDate)
            });
        });

        return (
            <Wrapper theme={this.props.theme}>
                <ListHeader>Schedule</ListHeader>
                <TabGroupContainer>
                    <TabGroup
                        defaultIndex={this.state.initialDateIndex}
                        tabs={[
                            {
                                title: 'Friday',
                                onClick: this.tabSelect
                            },
                            {
                                title: 'Saturday',
                                onClick: this.tabSelect
                            },
                            {
                                title: 'Sunday',
                                onClick: this.tabSelect
                            }
                        ]}
                        primaryColor={this.props.theme.highlight}
                    />
                </TabGroupContainer>
                <CalendarContainer theme={this.props.theme}>
                    <Calendar
                        events={events}
                        toolbar={false}
                        defaultView="day"
                        date={this.state.selectedDate}
                        onNavigate={() => {}}
                        step={60}
                        timeslots={1}
                        startAccessor="startDate"
                        endAccessor="endDate"
                        titleAccessor="name"
                        eventPropGetter={event => {
                            var color = 'darkslategray';

                            if (event.category === 'Tech Talk') {
                                color = '#0074d9';
                            } else if (event.category === 'Food') {
                                color = '#3d9970';
                            } else if (event.category === 'General') {
                                color = '#001f3f';
                            } else if (event.category === 'Sponsor Event') {
                                color = '#ff4136';
                            } else {
                                color = '#b10dc9';
                            }

                            return {
                                style: {
                                    backgroundColor: color,
                                    border: '1px solid white'
                                }
                            };
                        }}
                        components={{
                            event: Event
                        }}
                    />
                </CalendarContainer>
            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data,
        eventsState: state.eventsState,
        configurationState: state.configurationState
    };
}

export default connect(mapStateToProps)(Schedule);
