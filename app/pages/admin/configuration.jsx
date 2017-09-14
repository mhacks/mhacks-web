import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ConfigurationThunks } from '../../actions';
import { MHForm, Container } from '../../components';

const SlimContainer = styled(Container)`max-width: 500px;`;
const H1 = styled.h1`padding: 20px 0;`;

class ConfigurationSection extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(ConfigurationThunks.loadForm());
    }

    onSubmit(formData) {
        this.props.dispatch(ConfigurationThunks.updateConfig(formData));
    }

    render() {
        return (
            <SlimContainer>
                <H1>Configuration</H1>
                <MHForm
                    initialData={this.props.configurationState.data}
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
