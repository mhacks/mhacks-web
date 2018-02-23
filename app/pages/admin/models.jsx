import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { PageContainer } from '../../components';
import { AdminThunks } from '../../actions';
import { routes } from '../../constants';
import ReactTable from 'react-table';

const PagePulled = styled(PageContainer)`
    min-height: calc(100vh - 146px);
`;

const Link = styled.a`
    &:hover {
        text-decoration: underline;
    }
`;

/* Page Component */
class ModelsPage extends React.Component {
    componentDidMount() {
        this.props.dispatch(AdminThunks.loadModels());
    }

    render() {
        const models = Object.keys(this.props.adminState.models);
        const tableData = models.map(model => {
            return {
                name: model
            };
        });

        return (
            <PagePulled ref="pagecontainer">
                <ReactTable
                    data={tableData}
                    loading={this.props.adminState.fetching}
                    columns={[
                        {
                            Header: 'Models',
                            columns: [
                                {
                                    Header: 'Name',
                                    accessor: 'name',
                                    Cell: row => (
                                        <Link
                                            onClick={() => {
                                                this.context.router.history.push(
                                                    routes.ADMIN +
                                                        '/' +
                                                        row.value
                                                );
                                            }}
                                        >
                                            {row.value}
                                        </Link>
                                    )
                                }
                            ]
                        }
                    ]}
                    className="-striped -highlight"
                />
            </PagePulled>
        );
    }
}

ModelsPage.contextTypes = {
    router: React.PropTypes.shape({
        history: React.PropTypes.object.isRequired
    })
};

function mapStateToProps(state) {
    return {
        theme: state.theme.data,
        adminState: state.adminState
    };
}

export default connect(mapStateToProps)(ModelsPage);
