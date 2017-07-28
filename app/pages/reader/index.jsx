import React from 'react';
import styled from 'styled-components';
import { devices } from '../../styles';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { MHForm, PageContainer, RoundedButton } from '../../components';
import { ReaderThunks } from '../../actions';
import { FormattedRelative } from 'react-intl';
import Fuse from 'fuse.js';
import {
    ApplicationReaderFiltersSchema,
    ApplicationReaderSchema
} from '../../constants/forms';

const HeaderSection = styled.div`
    display: flex;
    flexDirection: column;
    justifyContent: space-between;
    padding: 10px 20px;

    ${devices.tablet`
        flexDirection: row;
    `}
`;

const SubsectionContainer = styled.div`
    display: flex;
    flexDirection: row;
    padding: 0 20px;
`;

const A = styled.a`
    text-align: center;
`;

const UtilityContainer = styled.div`
    padding: 20px;
`;

function isMinor(birthdate) {
    const now = new Date();
    const birth = new Date(birthdate);

    var age = now.getFullYear() - birth.getFullYear();
    const ageMonth = now.getMonth() - birth.getMonth();
    const ageDay = now.getDate() - birth.getDate();

    if (ageMonth < 0 || (ageMonth === 0 && ageDay < 0)) {
        age = parseInt(age) - 1;
    }

    return age < 18;
}

/* Page Component */
class ReaderPage extends React.Component {
    constructor() {
        super();

        this.state = {
            status: 'unread',
            score: 0,
            reimbursement: 0,
            selected: []
        };

        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.generateColumns = this.generateColumns.bind(this);
        this.filterApplications = this.filterApplications.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(ReaderThunks.loadApplications());
    }

    // Generic function for changing state
    // -- input using this must have a name attribute
    handleAttributeChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    didSelect(user) {
        return () => {
            if (this.state.selected.includes(user)) {
                this.setState({
                    selected: this.state.selected.filter(ele => ele !== user)
                });
            } else {
                this.setState({
                    selected: this.state.selected.concat(user)
                });
            }
        };
    }

    onSubmit(e) {
        e.preventDefault();

        const { selected, status, score, reimbursement } = this.state;

        this.props.dispatch(
            ReaderThunks.reviewApplications({
                users: selected,
                status,
                score,
                reimbursement
            })
        );
    }

    generateColumns(selected) {
        return [
            {
                Header: '',
                columns: [
                    {
                        Header: '',
                        width: 30,
                        Cell: row => {
                            const isSelected = selected.includes(
                                row.original.user
                            );
                            return (
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={this.didSelect(row.original.user)}
                                />
                            );
                        }
                    },
                    {
                        expander: true
                    },
                    {
                        Header: 'Name',
                        accessor: 'full_name'
                    }
                ]
            },
            {
                Header: 'Review',
                columns: [
                    {
                        Header: 'Submitted',
                        accessor: 'created_at',
                        Cell: row => <FormattedRelative value={row.value} />
                    },
                    {
                        Header: 'Status',
                        accessor: 'status'
                    },
                    {
                        Header: 'Score',
                        accessor: 'score',
                        width: 60
                    },
                    {
                        Header: 'Reimbursement',
                        accessor: 'reimbursement'
                    }
                ]
            },
            {
                Header: 'User',
                columns: [
                    {
                        Header: 'Email',
                        accessor: 'user'
                    },
                    {
                        Header: 'University',
                        accessor: 'university'
                    },
                    {
                        Header: 'Experience',
                        accessor: 'experience'
                    },
                    {
                        Header: 'Minor',
                        accessor: 'birthday',
                        width: 60,
                        Cell: row => {
                            return isMinor(row.value) ? 'Yes' : 'No';
                        }
                    }
                ]
            },
            {
                Header: 'Links',
                columns: [
                    {
                        Header: 'R',
                        accessor: 'resume',
                        width: 30,
                        Cell: row => <A target="_blank" href={row.value}>R</A>
                    },
                    {
                        Header: 'G',
                        accessor: 'github',
                        width: 30,
                        Cell: row => {
                            return row.value.length > 0
                                ? <A target="_blank" href={row.value}>G</A>
                                : null;
                        }
                    },
                    {
                        Header: 'L',
                        accessor: 'linkedin',
                        width: 30,
                        Cell: row => {
                            return row.value.length > 0
                                ? <A target="_blank" href={row.value}>L</A>
                                : null;
                        }
                    },
                    {
                        Header: 'D',
                        accessor: 'devpost',
                        width: 30,
                        Cell: row => {
                            return row.value.length > 0
                                ? <A target="_blank" href={row.value}>D</A>
                                : null;
                        }
                    },
                    {
                        Header: 'P',
                        accessor: 'portfolio',
                        width: 30,
                        Cell: row => {
                            return row.value.length > 0
                                ? <A target="_blank" href={row.value}>P</A>
                                : null;
                        }
                    }
                ]
            }
        ];
    }

    filterApplications(applications) {
        if (!this.state.filterData) {
            return applications;
        }

        const {
            status,
            reimbursement,
            minor,
            since,
            search
        } = this.state.filterData;

        const fuse = new Fuse(applications, {
            shouldSort: true,
            findAllMatches: true,
            threshold: 0.3,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['university', 'user']
        });

        const searched = search.length > 0 ? fuse.search(search) : applications;

        return searched.filter(application => {
            if (status !== 'all' && application.status !== status) {
                return false;
            }

            if (
                reimbursement !== 'all' &&
                ((reimbursement === 'yes' &&
                    !application.needs_reimbursement) ||
                    (reimbursement === 'no' && application.needs_reimbursement))
            ) {
                return false;
            }

            if (
                minor !== 'all' &&
                ((minor === 'yes' && !isMinor(application.birthday)) ||
                    (minor === 'no' && isMinor(application.birthday)))
            ) {
                return false;
            }

            const submitted_since = Date.parse(since);
            if (
                !isNaN(submitted_since) &&
                new Date(submitted_since) > new Date(application.created_at)
            ) {
                return false;
            }

            return true;
        });
    }

    render() {
        return (
            <PageContainer ref="pagecontainer">
                <HeaderSection>
                    <MHForm
                        schema={ApplicationReaderFiltersSchema}
                        theme={this.props.theme}
                        onChange={formState => {
                            this.setState({
                                filterData: formState
                            });
                        }}
                    />
                    <MHForm
                        schema={ApplicationReaderSchema}
                        theme={this.props.theme}
                        onSubmit={this.onSubmit}
                    />
                </HeaderSection>
                <ReactTable
                    data={this.filterApplications(
                        this.props.readerState.data.applications
                    )}
                    columns={this.generateColumns(this.state.selected)}
                    SubComponent={row => {
                        const data = row.original;
                        return (
                            <SubsectionContainer>
                                <div>
                                    <h4>Why MHacks?</h4>
                                    <p>{data.why_mhacks}</p>
                                    <h4>Favorite Memory?</h4>
                                    <p>{data.favorite_memory}</p>
                                    <h4>Anything Else?</h4>
                                    <p>{data.anything_else}</p>
                                    <h4>Departing From</h4>
                                    <p>{data.departing_from}</p>
                                    <h4>Needs Reimbursement</h4>
                                    <p>
                                        {data.needs_reimbursement
                                            ? 'true'
                                            : 'false'}
                                    </p>
                                    <h4>Requested Reimbursement</h4>
                                    <p>{data.requested_reimbursement}</p>
                                    <h4>race</h4>
                                    <p>{data.race}</p>
                                    <h4>sex</h4>
                                    <p>{data.sex}</p>
                                    <h4>tshirt</h4>
                                    <p>{data.tshirt}</p>
                                </div>
                            </SubsectionContainer>
                        );
                    }}
                />
                <UtilityContainer>
                    <RoundedButton
                        color={this.props.theme.primary}
                        onClick={() => {
                            const { applications } = this.props.readerState.data;
                            if (applications.length === 0) {
                                return;
                            }
                            const keys = Object.keys(applications[0]);
                            const meta = 'data:text/csv;charset=utf-8,';
                            const keyList = keys.join(',') + '\n';
                            const data = applications.map(app => {
                                return keys.map(key => app[key]).join(',');
                            }).join('\n');
                            window.open(encodeURI(meta + keyList + data));
                        }}
                    >
                        CSV
                    </RoundedButton>
                </UtilityContainer>
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

export default connect(mapStateToProps)(ReaderPage);
