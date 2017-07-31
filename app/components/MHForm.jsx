import React from 'react';
import styled from 'styled-components';
import LabeledInput from './LabeledInput.jsx';
import RoundedButton from './RoundedButton.jsx';
import { FieldTypes } from '../constants/forms';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';

const SectionHeader = styled.h3`
    fontSize: 22px;
    color: ${props => props.color};
    fontWeight: 500;
    margin: 26px 0 0 0;
`;

const Input = styled.input`
    height: 36px;
    width: 100%;
    paddingLeft: 10px;
    border: 1px solid #ccc;
    borderRadius: 4px;
`;

function getFieldDefault(field) {
    switch (field.type) {
        case FieldTypes.TEXT:
        case FieldTypes.ESSAY:
        case FieldTypes.SELECT:
        case FieldTypes.LINK:
            return field.default || '';
        case FieldTypes.DATE:
            return field.default || 'yyyy-mm-dd';
        case FieldTypes.INTEGER:
            return field.default || 0;
        case FieldTypes.BOOLEAN:
            return field.default || false;
        case FieldTypes.MULTI:
            return field.default || [];
    }
}

class MHForm extends React.Component {
    constructor(props) {
        super(props);

        const initialState = {};

        for (const field of props.schema) {
            const defaultValue = getFieldDefault(field);
            if (defaultValue !== undefined) {
                initialState[field.key] = defaultValue;
            }
        }

        this.state = initialState;
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
    }

    // Generic function for changing state
    // -- input using this must have a name attribute
    handleAttributeChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                if (this.props.onChange) {
                    this.props.onChange(this.state);
                }
            }
        );
    }

    handleSelectChange(name) {
        return selection => {
            const field = this.props.schema[
                this.props.schema.findIndex(field => {
                    return field.key === name;
                })
            ];
            const completion = () => {
                if (this.props.onChange) {
                    this.props.onChange(this.state);
                }
            };

            const newValue = FieldTypes.MULTI ? selection : selection.value;

            this.setState(
                {
                    [name]: selection ? newValue : getFieldDefault(field)
                },
                completion
            );
        };
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
            <form
                onSubmit={e => {
                    e.preventDefault();
                    this.props.onSubmit(this.state);
                }}
            >
                {this.props.schema.map(field => {
                    switch (field.type) {
                        case FieldTypes.SELECT:
                            return this.renderLabeledInput(
                                field,
                                <Select
                                    name={field.key}
                                    value={this.state[field.key]}
                                    options={field.options}
                                    onChange={this.handleSelectChange(
                                        field.key
                                    )}
                                />
                            );
                        case FieldTypes.MULTI:
                            return this.renderLabeledInput(
                                field,
                                <Select
                                    name={field.key}
                                    value={this.state[field.key]}
                                    options={field.options}
                                    multi={true}
                                    onChange={this.handleSelectChange(
                                        field.key
                                    )}
                                />
                            );
                        case FieldTypes.TEXT:
                            return this.renderLabeledInput(
                                field,
                                <Input
                                    name={field.key}
                                    type="text"
                                    placeholder={field.placeholder}
                                    value={this.state[field.key]}
                                    onChange={this.handleAttributeChange}
                                />
                            );
                        case FieldTypes.INTEGER:
                            return this.renderLabeledInput(
                                field,
                                <Input
                                    name={field.key}
                                    type="number"
                                    value={this.state[field.key]}
                                    onChange={this.handleAttributeChange}
                                />
                            );
                        case FieldTypes.DATE:
                            return this.renderLabeledInput(
                                field,
                                <Input
                                    name={field.key}
                                    type="date"
                                    placeholder="yyyy-mm-dd"
                                    value={this.state[field.key]}
                                    onChange={this.handleAttributeChange}
                                />
                            );
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
