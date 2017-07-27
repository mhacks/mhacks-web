import React from 'react';
import styled from 'styled-components';
import LabeledInput from './LabeledInput.jsx';
import RoundedButton from './RoundedButton.jsx';
import { FieldTypes } from '../constants/forms';

const SectionHeader = styled.h3`
    fontSize: 22px;
    color: ${props => props.color};
    fontWeight: 500;
    margin: 26px 0 0 0;
`;

class MHForm extends React.Component {
    constructor(props) {
        super(props);

        const initialState = {};

        for (const field of props.schema) {
            switch (field.type) {
                case FieldTypes.TEXT:
                case FieldTypes.ESSAY:
                case FieldTypes.LINK:
                    initialState[field.key] = field.default || '';
                    break;
                case FieldTypes.DATE:
                    initialState[field.key] = field.default || 'yyyy-mm-dd';
                    break;
                case FieldTypes.SELECT:
                    initialState[field.key] = field.default || field.options[0].key;
                    break;
                case FieldTypes.INTEGER:
                    initialState[field.key] = field.default || 0;
                    break;
                case FieldTypes.BOOLEAN:
                    initialState[field.key] = field.default || false;
                    break;
            }
        }

        this.state = initialState;
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
    }

    // Generic function for changing state
    // -- input using this must have a name attribute
    handleAttributeChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => {
            this.props.onChange(this.state);
        });
    }

    renderLabeledInput(field, contents) {
        return (
            <LabeledInput
                label={field.label}
                required={field.required || false}
                key={field.key}
            >
                {contents}
            </LabeledInput>
        );
    }

    render() {
        return (
            <form onSubmit={this.props.onSubmit}>
                {this.props.schema.map(field => {
                    switch (field.type) {
                        case FieldTypes.SELECT:
                            return this.renderLabeledInput(field, (
                                <select
                                    name={field.key}
                                    value={this.state[field.key]}
                                    onChange={this.handleAttributeChange}
                                >
                                    {field.options.map(option => {
                                        return (
                                            <option
                                                value={option.key}
                                                key={option.key}
                                            >
                                                {option.title}
                                            </option>
                                        );
                                    })}
                                </select>
                            ));
                        case FieldTypes.TEXT:
                            return this.renderLabeledInput(field, (
                                <input
                                    name={field.key}
                                    type="text"
                                    placeholder={field.placeholder}
                                    value={this.state[field.key]}
                                    onChange={this.handleAttributeChange}
                                />
                            ));
                        case FieldTypes.INTEGER:
                            return this.renderLabeledInput(field, (
                                <input
                                    name={field.key}
                                    type="number"
                                    value={this.state[field.key]}
                                    onChange={this.handleAttributeChange}
                                />
                            ));
                        case FieldTypes.DATE:
                            return this.renderLabeledInput(field, (
                                <input
                                    name={field.key}
                                    type="date"
                                    placeholder="yyyy-mm-dd"
                                    value={this.state[field.key]}
                                    onChange={this.handleAttributeChange}
                                />
                            ));
                        case FieldTypes.SECTIONHEADER:
                            return (
                                <SectionHeader
                                    color={this.props.theme.primary}
                                    key={field.title}
                                >
                                    {field.title}
                                </SectionHeader>
                            );
                        case FieldTypes.SUBMIT:
                            return (
                                <RoundedButton
                                    type="submit"
                                    color={this.props.theme.primary}
                                    key={field.title}
                                >
                                    {field.title}
                                </RoundedButton>
                            );
                    }
                })}
            </form>
        );
    }
}

export default MHForm;
