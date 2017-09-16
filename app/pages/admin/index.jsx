import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { PageContainer } from '../../components';
import { AdminThunks } from '../../actions';

const PagePulled = styled(PageContainer)`min-height: calc(100vh - 146px);`;

/* Page Component */
class AdminPage extends React.Component {
    componentDidMount() {
        this.props.dispatch(AdminThunks.loadModels());
    }

    render() {
        return (
            <PagePulled ref="pagecontainer">
                <p>Hey</p>
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

export default connect(mapStateToProps)(AdminPage);
