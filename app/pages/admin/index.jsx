import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { PageContainer, LabeledInput, RoundedButton } from '../../components';
import { AdminThunks } from '../../actions';
import { FormattedRelative } from 'react-intl';

const HeaderSection = styled.div`
    display: flex;
    flexDirection: row;
    justifyContent: space-between;
    padding: 10px 20px;
`;

const A = styled.a`
    text-align: center;
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
class AdminPage extends React.Component {
    constructor() {
        super();

        this.state = {
            status: 'unread',
            score: 0,
            reimbursement: 0,
            selected: []
        }

        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.generateColumns = this.generateColumns.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(AdminThunks.loadApplications());
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
            this.setState({
                selected: this.state.selected.concat(user)
            });
        };
    }

    onSubmit(e) {
        e.preventDefault();
    }

    generateColumns(selected) {
        return  [
            {
                Header: 'Select',
                columns: [
                    {
                        Header: '',
                        Cell: (row) => {
                            const isSelected = selected.includes(row.original.user);
                            return (
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={this.didSelect(row.original.user)}
                                />
                            );
                        }
                    }
                ]
            },
            {
                Header: 'App',
                columns: [
                    {
                        expander: true
                    },
                    {
                        Header: 'Submitted',
                        accessor: 'created_at',
                        Cell: (row) => (
                            <FormattedRelative
                                value={row.value}
                            />
                        )
                    }
                ]
            },
            {
                Header: 'User',
                columns: [
                    {
                        Header: 'Name',
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
                        Cell: (row) => {
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
                        Cell: (row) => (
                            <A href={row.value}>R</A>
                        )
                    },
                    {
                        Header: 'G',
                        accessor: 'github',
                        width: 30,
                        Cell: (row) => {
                            return row.value.length > 0 ? <A href={row.value}>G</A> : null;
                        }
                    },
                    {
                        Header: 'L',
                        accessor: 'linkedin',
                        width: 30,
                        Cell: (row) => {
                            return row.value.length > 0 ? <A href={row.value}>L</A> : null;
                        }
                    },
                    {
                        Header: 'D',
                        accessor: 'devpost',
                        width: 30,
                        Cell: (row) => {
                            return row.value.length > 0 ? <A href={row.value}>D</A> : null;
                        }
                    },
                    {
                        Header: 'P',
                        accessor: 'portfolio',
                        width: 30,
                        Cell: (row) => {
                            return row.value.length > 0 ? <A href={row.value}>P</A> : null;
                        }
                    }
                ]
            }
        ];
    }


    render() {
        return (
            <PageContainer ref="pagecontainer">
                <HeaderSection>
                    <div>toggles go here</div>
                    <form onSubmit={this.onSubmit}>
                      <LabeledInput label="Status">
                          <select
                              name="status"
                              value={this.state.status}
                              onChange={
                                  this.handleAttributeChange
                              }
                          >
                              <option value="unread">Unread</option>
                              <option value="waitlisted">Waitlisted</option>
                              <option value="accepted">Accepted</option>
                          </select>
                      </LabeledInput>
                      <LabeledInput label="Score">
                          <input
                              name="score"
                              type="number"
                              value={this.state.score}
                              onChange={
                                  this.handleAttributeChange
                              }
                          />
                      </LabeledInput>
                      <LabeledInput label="Reimbursement">
                          <input
                              name="reimbursement"
                              type="number"
                              value={this.state.reimbursement}
                              onChange={
                                  this.handleAttributeChange
                              }
                          />
                      </LabeledInput>
                        <RoundedButton
                            type="submit" 
                        >
                            Save
                        </RoundedButton>
                    </form>
                </HeaderSection>
                <ReactTable
                    data={this.props.adminState.data.applications}
                    columns={this.generateColumns(this.state.selected)}
                    SubComponent={(row) => {
                        const data = row.original;
                        return (
                            <div>
                                <h4>Why MHacks?</h4>
                                <p>{data.why_mhacks}</p>
                                <h4>Favorite Memory?</h4>
                                <p>{data.favorite_memory}</p>
                                <h4>Anything Else?</h4>
                                <p>{data.anything_else}</p>
                            </div>
                        );
                    }}
                />
            </PageContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        adminState: state.adminState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(AdminPage);
