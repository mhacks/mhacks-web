import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ConfigurationThunks } from '../../actions';
import { MHForm, Container } from '../../components';

const SlimContainer = styled(Container)`max-width: 500px;`
const H1 = styled.h1`padding: 20px 0;`

class ConfigurationSection extends Component {

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
            <SlimContainer>
                <H1>Configuration</H1>
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
