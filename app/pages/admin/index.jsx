import React from 'react';
import { connect } from 'react-redux';
import { PageContainer } from '../../components';
import { AdminThunks } from '../../actions';

/* Page Component */
class AdminPage extends React.Component {

    componentDidMount() {
        this.props.dispatch(AdminThunks.loadApplications());
    }

    render() {
        return (
            <PageContainer ref="pagecontainer">
                <p>admin page</p>
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
