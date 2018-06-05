import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { PageContainer, RoundedButton } from '../../components';
import { AdminThunks } from '../../actions';
import ReactTable from 'react-table';
import { routes } from '../../constants';
import PropTypes from 'prop-types';

const PagePulled = styled(PageContainer)`
    min-height: calc(100vh - 146px);
`;

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
                <RoundedButton
                    type="submit"
                    color={this.props.theme.primary}
                    onClick={() => {
                        this.context.router.history.push(
                            routes.ADMIN + '/' + modelKey + '/create'
                        );
                    }}
                >
                    Create
                </RoundedButton>
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

                                        if (typeof row.value === 'boolean') {
                                            if (row.value) {
                                                return 'Yes';
                                            }

                                            return 'No';
                                        }

                                        return row.value;
                                    }
                                };
                            })
                        }
                    ]}
                    className="-striped -highlight"
                    getTrProps={(state, rowInfo) => ({
                        onClick: () => {
                            this.context.router.history.push(
                                routes.ADMIN +
                                    '/' +
                                    this.props.model +
                                    '/' +
                                    rowInfo.row.id
                            );
                        }
                    })}
                />
            </PagePulled>
        );
    }
}

Model.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired
    })
};

function mapStateToProps(state) {
    return {
        theme: state.theme.data,
        adminState: state.adminState
    };
}

export default connect(mapStateToProps)(Model);
