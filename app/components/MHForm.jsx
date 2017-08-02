import React from 'react';
import styled from 'styled-components';
import LabeledInput from './LabeledInput.jsx';
import RoundedButton from './RoundedButton.jsx';
import Alert from './Alert.jsx';
import { FieldTypes } from '../constants/forms';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';

const AlertContainer = styled.div`
    marginTop: 30px;
`;

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

        const initialState = {
            errorFields: [],
            formData: {}
        };

        for (const field of props.schema) {
            const defaultValue = getFieldDefault(field);
            if (defaultValue !== undefined) {
                initialState.formData[field.key] = defaultValue;
            }
        }

        this.state = initialState;
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.changeCompletion = this.changeCompletion.bind(this);
    }

    changeCompletion() {
        if (this.props.onChange) {
            this.props.onChange(this.formatFormData());
        }
    }

    // Generic function for changing state
    // -- input using this must have a name attribute
    handleAttributeChange(e) {
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [e.target.name]: e.target.value
                }
            },
            this.changeCompletion
        );
    }

    handleSelectChange(name) {
        return selection => {
            const field = this.props.schema[
                this.props.schema.findIndex(field => {
                    return field.key === name;
                })
            ];

            this.setState(
                {
                    formData: {
                        ...this.state.formData,
                        [name]: selection
                            ? field.type === FieldTypes.MULTI
                              ? selection
                              : selection.value
                            : getFieldDefault(field)
                    }
                },
                this.changeCompletion
            );
        };
    }

    validateFields() {
        const errors = [];
        const formData = this.state.formData;
        for (const field of this.props.schema) {
            if (!field.required) {
                continue;
            }

            switch (field.type) {
                case FieldTypes.TEXT:
                case FieldTypes.ESSAY:
                case FieldTypes.SELECT:
                case FieldTypes.LINK:
                    if (formData[field.key] === '') {
                        errors.push(field.key);
                    }
                    break;
                case FieldTypes.DATE:
                    if (isNaN(new Date(formData[field.key]).getTime())) {
                        errors.push(field.key);
                    }
                    break;
                case FieldTypes.MULTI:
                    if (formData[field.key].length > 0) {
                        errors.push(field.key);
                    }
            }
        }

        return errors;
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

    onSubmit(e) {
        e.preventDefault();
        const errorFields = this.validateFields();

        if (errorFields.length === 0) {
            this.props.onSubmit(this.formatFormData());
        } else {
            this.setState({
                errorFields
            });
        }
    }

    formatFormData() {
        const formatted = {};
        const formData = this.state.formData;
        for (const field of this.props.schema) {
            switch (field.type) {
                case FieldTypes.TEXT:
                case FieldTypes.ESSAY:
                case FieldTypes.LINK:
                case FieldTypes.INTEGER:
                case FieldTypes.BOOLEAN:
                    formatted[field.key] = formData[field.key];
                    break;
                case FieldTypes.DATE:
                    formatted[field.key] = new Date(formData[field.key]);
                    break;
                case FieldTypes.SELECT:
                    formatted[field.key] = formData[field.key];
                    break;
                case FieldTypes.MULTI:
                    formatted[field.key] = formData[field.key].map(
                        obj => obj.label
                    );
            }
        }

        return formatted;
    }

    render() {
        const formData = this.state.formData;
        return (
            <form onSubmit={this.onSubmit}>
                {this.state.errorFields.length > 0
                    ? <AlertContainer>
                          <Alert message="Missing some required fields!" />
                      </AlertContainer>
                    : null}
                {this.props.schema
                    .filter(field => {
                        return !this.props.hidden[field.key];
                    })
                    .map(field => {
                        switch (field.type) {
                            case FieldTypes.SELECT:
                                return this.renderLabeledInput(
                                    field,
                                    <Select
                                        name={field.key}
                                        value={formData[field.key]}
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
                                        value={formData[field.key]}
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
                                        value={formData[field.key]}
                                        onChange={this.handleAttributeChange}
                                    />
                                );
                            case FieldTypes.INTEGER:
                                return this.renderLabeledInput(
                                    field,
                                    <Input
                                        name={field.key}
                                        type="number"
                                        value={formData[field.key]}
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
                                        value={formData[field.key]}
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

MHForm.defaultProps = {
    hidden: {}
};

export default MHForm;
