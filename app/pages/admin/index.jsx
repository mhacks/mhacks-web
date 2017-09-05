import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { PageContainer } from '../../components';
import ConfigurationSection from './configuration';

const PagePulled = styled(PageContainer)`min-height: calc(100vh - 146px);`

/* Page Component */
class AdminPage extends React.Component {

    render() {
        return (
            <PagePulled ref="pagecontainer">
                <ConfigurationSection />
            </PagePulled>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(AdminPage);
