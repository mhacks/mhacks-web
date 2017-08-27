import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { MHForm, PageContainer } from '../../components';
import { ReaderThunks } from '../../actions';
import { FormattedRelative } from 'react-intl';
import { isMinor } from '../../util/user.js';
import Fuse from 'fuse.js';
import FontAwesome from 'react-fontawesome';
import { HeaderSection, SubsectionContainer, UtilityBar } from './components';
import { generateCSV } from './util.js';

const A = styled.a`
    text-align: center;
`;

const BadMark = <FontAwesome name="times" style={{ color: '#FF4136' }} />;
const GoodMark = <FontAwesome name="check" style={{ color: '#2ECC40' }} />;

/* Page Component */
class ReaderPage extends React.Component {
    constructor() {
        super();

        this.state = {
            selected: []
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.generateColumns = this.generateColumns.bind(this);
        this.filterApplications = this.filterApplications.bind(this);
        this.generateCSV = this.generateCSV.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.deselectAll = this.deselectAll.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(ReaderThunks.loadApplications());
        this.props.dispatch(ReaderThunks.loadForm('reader_filter'));
        this.props.dispatch(ReaderThunks.loadForm('reader_schema'));
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

    onSubmit(formData) {
        this.props.dispatch(
            ReaderThunks.reviewApplications(this.state.selected, formData)
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
                        Header: 'Adult',
                        accessor: 'birthday',
                        width: 60,
                        Cell: row => {
                            return isMinor(row.value) ? BadMark : GoodMark;
                        }
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
                            return row.value
                                ? <A target="_blank" href={row.value}>
                                      {GoodMark}
                                  </A>
                                : BadMark;
                        }
                    },
                    {
                        Header: <FontAwesome name="github" />,
                        accessor: 'github',
                        width: 30,
                        Cell: row => {
                            return row.value
                                ? <A target="_blank" href={row.value}>
                                      {GoodMark}
                                  </A>
                                : BadMark;
                        }
                    },
                    {
                        Header: <FontAwesome name="linkedin-square" />,
                        accessor: 'linkedin',
                        width: 30,
                        Cell: row => {
                            return row.value
                                ? <A target="_blank" href={row.value}>
                                      {GoodMark}
                                  </A>
                                : BadMark;
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
                            return row.value
                                ? <A target="_blank" href={row.value}>
                                      {GoodMark}
                                  </A>
                                : BadMark;
                        }
                    },
                    {
                        Header: <FontAwesome name="user" />,
                        accessor: 'portfolio',
                        width: 30,
                        Cell: row => {
                            return row.value
                                ? <A target="_blank" href={row.value}>
                                      {GoodMark}
                                  </A>
                                : BadMark;
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
            needs_reimbursement,
            experience,
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
            if (status && application.status !== status) {
                return false;
            }

            if (experience && application.experience !== experience) {
                return false;
            }

            if (
                (needs_reimbursement === 'yes' &&
                    !application.needs_reimbursement) ||
                (needs_reimbursement === 'no' &&
                    application.needs_reimbursement)
            ) {
                return false;
            }

            if (
                (minor === 'yes' && !isMinor(application.birthday)) ||
                (minor === 'no' && isMinor(application.birthday))
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

    generateCSV() {
        const { applications } = this.props.readerState.data;
        if (applications.length === 0) {
            return;
        }
        const keys = Object.keys(applications[0]);
        const meta = 'data:text/csv;charset=utf-8,';
        const keyList = keys.join(',') + '\n';
        const data = applications
            .map(app => {
                return keys.map(key => app[key]).join(',');
            })
            .join('\n');
        window.open(encodeURI(meta + keyList + data));
    }

    deselectAll() {
        this.setState({
            selected: []
        });
    }

    selectAll() {
        const filtered = this.filterApplications(
            this.props.readerState.data.applications
        );

        this.setState({
            selected: filtered.map(application => application.user)
        });
    }

    render() {
        if (
            !this.props.readerState.data.form &&
            !(
                this.props.readerState.data.form &&
                !(Object.values(this.props.readerState.data.form).length > 1)
            )
        ) {
            return null;
        }

        return (
            <PageContainer ref="pagecontainer">
                <HeaderSection>
                    <MHForm
                        schema={this.props.readerState.data.form.reader_filter}
                        FieldTypes={this.props.readerState.data.FieldTypes}
                        theme={this.props.theme}
                        onChange={formState => {
                            this.setState({
                                filterData: formState
                            });
                        }}
                    />
                    <MHForm
                        schema={this.props.readerState.data.form.reader_schema}
                        FieldTypes={this.props.readerState.data.FieldTypes}
                        theme={this.props.theme}
                        onSubmit={this.onSubmit}
                    />
                </HeaderSection>
                <UtilityBar
                    theme={this.props.theme}
                    utilities={[
                        {
                            onClick: this.selectAll,
                            title: 'Select All'
                        },
                        {
                            onClick: this.deselectAll,
                            title: 'Deselect All (' + this.state.selected.length + ')'
                        },
                        {
                            onClick: () => {generateCSV(this.props.readerState.data.applications)},
                            title: 'CSV'
                        }
                    ]}
                />
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
