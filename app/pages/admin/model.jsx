import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { PageContainer } from '../../components';
import { AdminThunks } from '../../actions';
import ReactTable from 'react-table';

const PagePulled = styled(PageContainer)`min-height: calc(100vh - 146px);`;

/* Page Component */
class Model extends React.Component {
    componentDidMount() {
        this.props.dispatch(AdminThunks.loadModel(this.props.model));
    }

    render() {
        const modelKey = this.props.model;
        const modelData = this.props.adminState.models[modelKey] || {};
        const documents = modelData.documents;
        const fields =
            documents && documents.length > 0 ? Object.keys(documents[0]) : [];

        return (
            <PagePulled ref="pagecontainer">
                <h2>{modelKey}</h2>
                <ReactTable
                    data={documents}
                    loading={this.props.adminState.fetching}
                    columns={[
                        {
                            Header: 'Fields',
                            columns: fields.map(key => {
                                return {
                                    Header: key,
                                    accessor: key,
                                    Cell: row => {
                                        if (Array.isArray(row.value)) {
                                            return JSON.stringify(row.value);
                                        }

                                        return row.value;
                                    }
                                };
                            })
                        }
                    ]}
                    className="-striped -highlight"
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
