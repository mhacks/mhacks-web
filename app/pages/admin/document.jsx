import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { PageContainer } from '../../components';
//import { AdminThunks } from '../../actions';

const PagePulled = styled(PageContainer)`min-height: calc(100vh - 146px);`;

/* Page Component */
class Document extends React.Component {
    render() {
        const document = this.props.document;

        return (
            <PagePulled ref="pagecontainer">
                <h2>{document.id}</h2>
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

export default connect(mapStateToProps)(Document);
