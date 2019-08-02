import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { MHForm } from '../../components';
import { PageContainer } from '../../components';
import { AdminThunks } from '../../actions';
import ReactTable from 'react-table';
import { routes } from '../../constants';
import { push } from 'connected-react-router';
import Fuse from 'fuse.js';
import adminFilter from './filter.json';
import { generateCSV } from '../reader/util';
import { UtilityBar } from '../reader/components';

const PagePulled = styled(PageContainer)`
    min-height: calc(100vh - 146px);
`;

/* Page Component */
class Model extends React.Component {
    constructor() {
        super();

        this.state = {
            selected: []
        };
    }

    componentDidMount() {
        this.props.dispatch(AdminThunks.loadModel(this.props.model));
    }

    filterDocuments(documents) {
        if (!this.state.filterData) {
            return documents;
        }

        const fuse = new Fuse(documents, {
            shouldSort: true,
            findAllMatches: true,
            threshold: 0.3,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: Object.keys(documents.length > 0 ? documents[0] : {})
        });

        return this.state.filterData.search.length > 0
            ? fuse.search(this.state.filterData.search)
            : documents;
    }

    render() {
        const modelKey = this.props.model;
        const modelData = this.props.adminState.models[modelKey] || {};
        const documents = modelData.documents;
        const fields =
            documents && documents.length > 0 ? Object.keys(documents[0]) : [];

        const filteredDocs = this.filterDocuments(documents);

        return (
            <PagePulled ref="pagecontainer">
                <h2>{modelKey}</h2>
                <MHForm
                    schema={adminFilter}
                    theme={this.props.theme}
                    onChange={formState => {
                        this.setState({
                            filterData: formState
                        });
                    }}
                />
                <UtilityBar
                    theme={this.props.theme}
                    utilities={[
                        {
                            onClick: () => {
                                this.props.dispatch(
                                    push(
                                        routes.ADMIN +
                                            '/' +
                                            modelKey +
                                            '/create'
                                    )
                                );
                            },
                            title: 'Create'
                        },
                        {
                            onClick: () => {
                                generateCSV(filteredDocs, 'docs.csv');
                            },
                            title: 'CSV'
                        },
                        {
                            title: filteredDocs ? filteredDocs.length : 0
                        }
                    ]}
                />
                <ReactTable
                    data={filteredDocs}
                    loading={this.props.adminState.fetching}
                    columns={[
                        {
                            Header: 'Fields',
                            columns: fields.map(key => {
                                return {
                                    Header: key,
                                    accessor: key,
                                    Cell: row => {
                                        if (
                                            Array.isArray(row.value) ||
                                            typeof row.value === 'object'
                                        ) {
                                            return JSON.stringify(row.value);
                                        }

                                        if (typeof row.value === 'boolean') {
                                            if (row.value) {
                                                return 'Yes';
                                            }

                                            return 'No';
                                        }

                                        return row.value || 'N/A';
                                    }
                                };
                            })
                        }
                    ]}
                    className="-striped -highlight"
                    getTrProps={(state, rowInfo) => ({
                        onClick: () => {
                            this.props.dispatch(
                                push(
                                    routes.ADMIN +
                                        '/' +
                                        this.props.model +
                                        '/' +
                                        rowInfo.row.id
                                )
                            );
                        }
                    })}
                />
            </PagePulled>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data,
        adminState: state.adminState
    };
}

export default connect(mapStateToProps)(Model);
