import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ConfigurationThunks } from '../../actions';
import { MHForm, Container } from '../../components';

const SlimContainer = styled(Container)`max-width: 500px;`
const H1 = styled.h1`padding: 20px 0;`

class ConfigurationSection extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(ConfigurationThunks.loadForm());
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.configurationState &&
            nextProps.configurationState.data &&
            nextProps.configurationState.data.form
        ) {
            for (var i in nextProps.configurationState) {
                if (i in nextProps.configurationState.data.form) {
                    nextProps.configurationState.data.form[i].default =
                        nextProps.configurationState[i];
                }
            }
        }

        this.setState({
            configurationState: nextProps.configurationState
        });
    }

    onSubmit(formData) {
        // TODO: create update config
        this.props.dispatch(ConfigurationThunks.updateConfig(formData))
    }

    render() {
        return (
            <SlimContainer>
                <H1>Configuration</H1>
                <MHForm
                    schema={this.props.configurationState.data.form}
                    FieldTypes={this.props.configurationState.data.FieldTypes}
                    theme={this.props.theme}
                    onSubmit={this.onSubmit}
                />
            </SlimContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        configurationState: state.configurationState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(ConfigurationSection);
