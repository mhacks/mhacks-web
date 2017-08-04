import React from 'react';
import styled from 'styled-components';
import { devices } from '../../styles';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { MHForm, PageContainer } from '../../components';
import { ReaderThunks } from '../../actions';
import Fuse from 'fuse.js';
import {
    SponsorPortalFiltersSchema
} from '../../constants/forms';

const HeaderSection = styled.div`
    display: flex;
    flexDirection: column;
    justifyContent: space-between;
    padding: 10px 20px;

    ${devices.tablet`
        flexDirection: row;

        form {
            flex: 1;

            &:first-child {
                marginRight: 40px;
            }
        }
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
    padding: 0 20px;
    display: flex;
    flexWrap: wrap;
`;

const UtilityButton = styled.button`
    borderRadius: 20px;
    backgroundColor: transparent;
    color: ${props => props.color};
    fontWeight: 500;
    fontSize: 16px;
    padding: 8px 20px;
    border: 3px solid ${props => props.color};
    margin: 20px 20px 20px 0;

    &:hover {
        backgroundColor: ${props => props.color};
        color: white;
    }

    &:last-child {
        marginRight: 0;
    }
`;

/* Page Component */
class ReaderPage extends React.Component {
    constructor() {
        super();

        this.state = {};

        this.generateColumns = this.generateColumns.bind(this);
        this.filterApplications = this.filterApplications.bind(this);
        this.generateCSV = this.generateCSV.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(ReaderThunks.loadApplications());
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
                        accessor: 'user'
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
                            return row.value && row.value.length > 0
                                ? <A target="_blank" href={row.value}>G</A>
                                : null;
                        }
                    },
                    {
                        Header: 'L',
                        accessor: 'linkedin',
                        width: 30,
                        Cell: row => {
                            return row.value && row.value.length > 0
                                ? <A target="_blank" href={row.value}>L</A>
                                : null;
                        }
                    },
                    {
                        Header: 'D',
                        accessor: 'devpost',
                        width: 30,
                        Cell: row => {
                            return row.value && row.value.length > 0
                                ? <A target="_blank" href={row.value}>D</A>
                                : null;
                        }
                    },
                    {
                        Header: 'P',
                        accessor: 'portfolio',
                        width: 30,
                        Cell: row => {
                            return row.value && row.value.length > 0
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
            graduation,
            employment,
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

        const searched = search.length > 0 ? fuse.search(search) : applications;

        return searched.filter(application => {
            if (employment && application.employment !== employment) {
                return false;
            }

            if (graduation && application.graduation !== graduation) {
                return false;
            }

            var missingSkills = false;
            if (skills && skills.length > 0 && application.skills) {
                skills.forEach(skill => {
                    if (application.skills.indexOf(skill) === -1) {
                        missingSkills = true;
                    }
                });
            } else if (skills && skills.length > 0) {
                return false;
            }

            return !missingSkills;
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

    render() {
        return (
            <PageContainer ref="pagecontainer">
                <HeaderSection>
                    <MHForm
                        schema={SponsorPortalFiltersSchema}
                        theme={this.props.theme}
                        onChange={formState => {
                            this.setState({
                                filterData: formState
                            });
                        }}
                    />
                </HeaderSection>
                <UtilityContainer>
                    <UtilityButton
                        color={this.props.theme.primary}
                        onClick={this.generateCSV}
                    >
                        CSV
                    </UtilityButton>
                </UtilityContainer>
                <ReactTable
                    data={this.filterApplications(
                        this.props.readerState.data.applications
                    )}
                    columns={this.generateColumns()}
                    SubComponent={row => {
                        const data = row.original;
                        return (
                            <SubsectionContainer>
                                <p>Skills: {data.skills ? data.skills.join(', ') : 'undefined as user has not confirmed attendance yet.'}</p>
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
