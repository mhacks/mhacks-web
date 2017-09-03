import React from 'react';
import { connect } from 'react-redux';
import { MHForm, PageContainer } from '../../components';
import { ConfigurationThunks } from '../../actions';

/* Page Component */
class AdminPage extends React.Component {
    componentDidMount() {
        this.props.dispatch(ConfigurationThunks.loadForm());
    }

    render() {
        if (
            !this.props.configurationState.data.form &&
            !(
                this.props.configurationState.data.form &&
                !(Object.values(this.props.configurationState.data.form).length > 1)
            )
        ) {
            return null;
        }

        return (
            <PageContainer ref="pagecontainer">
                <MHForm
                    schema={this.props.configurationState.data.form}
                    FieldTypes={this.props.configurationState.data.FieldTypes}
                    theme={this.props.theme}
                    onChange={formState => {
                        this.setState({
                            configuration: formState
                        });
                    }}
                />
            </PageContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        configurationState: state.configurationState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(AdminPage);
