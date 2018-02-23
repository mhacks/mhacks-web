import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { PageContainer } from '../../components';
import { ReaderThunks } from '../../actions';
import FontAwesome from 'react-fontawesome';
import { isMinor } from '../../util/user.js';
import { SubsectionContainer, UtilityBar } from './components';
import { generateCSV } from './util.js';

const A = styled.a`
    text-align: center;
`;

const BadMark = <FontAwesome name="times" style={{ color: '#FF4136' }} />;
const GoodMark = <FontAwesome name="check" style={{ color: '#2ECC40' }} />;

/* Page Component */
class MentorReader extends React.Component {
    constructor() {
        super();

        this.generateColumns = this.generateColumns.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(ReaderThunks.loadMentorApplications());
    }

    generateColumns() {
        return [
            {
                Header: '',
                columns: [
                    {
                        expander: true
                    },
                    {
                        Header: 'Name',
                        accessor: 'name'
                    }
                ]
            },
            {
                Header: 'User',
                columns: [
                    {
                        Header: 'Email',
                        accessor: 'email'
                    },
                    {
                        Header: 'University',
                        accessor: 'university'
                    },
                    {
                        Header: 'Adult',
                        accessor: 'birthday',
                        width: 60,
                        Cell: row => {
                            return isMinor(row.value) ? BadMark : GoodMark;
                        }
                    },
                    {
                        Header: 'Shirt',
                        accessor: 'tshirt'
                    },
                    {
                        Header: 'Race',
                        accessor: 'race'
                    },
                    {
                        Header: 'Sex',
                        accessor: 'sex'
                    }
                ]
            },
            {
                Header: 'Application',
                columns: [
                    {
                        Header: 'Hackathon Count',
                        accessor: 'hackathons_been'
                    },
                    {
                        Header: 'Mentored Count',
                        accessor: 'hackathons_mentored'
                    },
                    {
                        Header: 'Availability',
                        accessor: 'availability_during'
                    }
                ]
            },
            {
                Header: 'Links',
                columns: [
                    {
                        Header: <FontAwesome name="paperclip" />,
                        accessor: 'resume',
                        width: 30,
                        Cell: row => {
                            return row.value ? (
                                <A target="_blank" href={row.value}>
                                    {GoodMark}
                                </A>
                            ) : (
                                BadMark
                            );
                        }
                    },
                    {
                        Header: <FontAwesome name="github" />,
                        accessor: 'github',
                        width: 30,
                        Cell: row => {
                            return row.value ? (
                                <A target="_blank" href={row.value}>
                                    {GoodMark}
                                </A>
                            ) : (
                                BadMark
                            );
                        }
                    },
                    {
                        Header: <FontAwesome name="linkedin-square" />,
                        accessor: 'linkedin',
                        width: 30,
                        Cell: row => {
                            return row.value ? (
                                <A target="_blank" href={row.value}>
                                    {GoodMark}
                                </A>
                            ) : (
                                BadMark
                            );
                        }
                    },
                    {
                        Header: (
                            <img
                                src="https://cdn.rawgit.com/nealrs/868af1e0ff6d60b7d638/raw/9500aac7536bd3a4652e63617aaf418d8cfa0a08/devpost-icon-black.svg"
                                height="14px"
                                width="14px"
                            />
                        ),
                        accessor: 'devpost',
                        width: 30,
                        Cell: row => {
                            return row.value ? (
                                <A target="_blank" href={row.value}>
                                    {GoodMark}
                                </A>
                            ) : (
                                BadMark
                            );
                        }
                    },
                    {
                        Header: <FontAwesome name="user" />,
                        accessor: 'portfolio',
                        width: 30,
                        Cell: row => {
                            return row.value ? (
                                <A target="_blank" href={row.value}>
                                    {GoodMark}
                                </A>
                            ) : (
                                BadMark
                            );
                        }
                    }
                ]
            }
        ];
    }

    render() {
        return (
            <PageContainer ref="pagecontainer">
                <UtilityBar
                    theme={this.props.theme}
                    utilities={[
                        {
                            onClick: () => {
                                generateCSV(
                                    this.props.readerState.data
                                        .mentorApplications,
                                    'mentor_applications.csv'
                                );
                            },
                            title: 'CSV'
                        }
                    ]}
                />
                <ReactTable
                    data={this.props.readerState.data.mentorApplications}
                    columns={this.generateColumns()}
                    SubComponent={row => {
                        const data = row.original;
                        return (
                            <SubsectionContainer>
                                <div>
                                    <h4>Skills</h4>
                                    <p>{data.skills.join(', ')}</p>
                                    <h4>Qualifications</h4>
                                    <p>{data.qualifications}</p>
                                </div>
                            </SubsectionContainer>
                        );
                    }}
                />
            </PageContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        readerState: state.readerState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(MentorReader);
