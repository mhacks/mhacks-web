import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { PageContainer, MHForm } from '../../components';
import { ReaderThunks } from '../../actions';
import { endpoints } from '../../constants';
import FontAwesome from 'react-fontawesome';
import Fuse from 'fuse.js';
import { HeaderSection, SubsectionContainer, UtilityBar } from './components';
import { generateCSV } from './util.js';

const A = styled.a`
    text-align: center;
`;

const BadMark = <FontAwesome name="times" style={{ color: '#FF4136' }} />;
const GoodMark = <FontAwesome name="check" style={{ color: '#2ECC40' }} />;

/* Page Component */
class SponsorReader extends React.Component {
    constructor() {
        super();

        this.state = {};

        this.generateColumns = this.generateColumns.bind(this);
        this.filterApplications = this.filterApplications.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(ReaderThunks.loadSponsorPortalApplications());
        this.props.dispatch(
            ReaderThunks.loadForm('confirmation/', 'sponsor_filter')
        );
    }

    generateColumns() {
        return [
            {
                Header: '',
                columns: [
                    {
                        Header: 'Name',
                        accessor: 'full_name'
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
                        Header: 'Degree',
                        accessor: 'degree'
                    },
                    {
                        Header: 'Grad Year',
                        accessor: 'graduation'
                    },
                    {
                        Header: 'Job Interest',
                        accessor: 'employment'
                    },
                    {
                        Header: 'Major',
                        accessor: 'major'
                    },
                    {
                        Header: 'Experience',
                        accessor: 'experience'
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
                        Cell: row => (
                            <A target="_blank" href={row.value}>
                                {GoodMark}
                            </A>
                        )
                    },
                    {
                        Header: <FontAwesome name="github" />,
                        accessor: 'github',
                        width: 30,
                        Cell: row => {
                            return row.value && row.value.length > 0 ? (
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
                            return row.value && row.value.length > 0 ? (
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
                            return row.value && row.value.length > 0 ? (
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
                            return row.value && row.value.length > 0 ? (
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

    filterApplications(applications) {
        if (!this.state.filterData) {
            return applications;
        }

        const {
            graduation,
            employment,
            degree,
            skills,
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
            keys: ['university', 'user', 'full_name']
        });

        const searched =
            (search && search.length) > 0 ? fuse.search(search) : applications;

        return searched.filter(application => {
            if (
                employment &&
                employment.length > 0 &&
                !employment.includes(application.employment)
            ) {
                return false;
            }

            if (
                degree &&
                degree.length > 0 &&
                !degree.includes(application.degree)
            ) {
                return false;
            }

            if (
                graduation &&
                graduation.length > 0 &&
                !graduation.includes(application.graduation)
            ) {
                return false;
            }

            var hasSkill = false;
            if (skills && skills.length > 0 && application.skills) {
                application.skills.forEach(skill => {
                    if (skills.includes(skill)) {
                        hasSkill = true;
                    }
                });
            } else {
                return true;
            }

            return hasSkill;
        });
    }

    render() {
        if (
            !(
                this.props.readerState.data.form &&
                Object.values(this.props.readerState.data.form).length > 0
            )
        ) {
            return null;
        }

        return (
            <PageContainer ref="pagecontainer">
                <HeaderSection>
                    <MHForm
                        schema={this.props.readerState.data.form.sponsor_filter}
                        FieldTypes={this.props.readerState.data.FieldTypes}
                        theme={this.props.theme}
                        onChange={formState => {
                            this.setState({
                                filterData: formState
                            });
                        }}
                    />
                </HeaderSection>
                <UtilityBar
                    theme={this.props.theme}
                    utilities={[
                        {
                            onClick: () => {
                                generateCSV(
                                    this.props.readerState.data
                                        .sponsorPortalApplications,
                                    'hacker_applications.csv'
                                );
                            },
                            title: 'CSV'
                        },
                        {
                            title: 'Download All Resumes',
                            onClick: () => {
                                window.open(endpoints.ALL_APPLICATION_RESUMES);
                            }
                        }
                    ]}
                />
                <ReactTable
                    data={this.filterApplications(
                        this.props.readerState.data.sponsorPortalApplications
                    )}
                    columns={this.generateColumns()}
                    loading={this.props.readerState.fetching}
                    SubComponent={row => {
                        const data = row.original;
                        return (
                            <SubsectionContainer>
                                <p>
                                    Skills:{' '}
                                    {data.skills
                                        ? data.skills.join(', ')
                                        : 'undefined as user has not confirmed attendance yet.'}
                                </p>
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

export default connect(mapStateToProps)(SponsorReader);
