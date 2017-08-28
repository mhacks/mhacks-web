import React from 'react';
import styled from 'styled-components';
import LabeledInput from './LabeledInput.jsx';
import RoundedButton from './RoundedButton.jsx';
import Alert from './Alert.jsx';
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

const TextArea = styled.textarea`
    padding: 10px;
    borderColor: rgb(215, 215, 215);
    flexGrow: 1;
    height: 120px;
    width: 100%;
    borderRadius: 5px;
`;

class MHForm extends React.Component {
    constructor(props) {
        super(props);

        const initialState = {
            errorFields: [],
            formData: {}
        };

        this.FieldTypes = props.FieldTypes;

        for (const field in props.schema) {
            const defaultValue = this.getFieldDefault(props.schema[field]);
            if (defaultValue !== undefined) {
                initialState.formData[field] = defaultValue;
            }
        }

        this.state = initialState;
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.changeCompletion = this.changeCompletion.bind(this);
    }

    getFieldDefault(field) {
        switch (field.type) {
            case this.FieldTypes.TEXT:
            case this.FieldTypes.ESSAY:
            case this.FieldTypes.SELECT:
            case this.FieldTypes.LINK:
                return field.default || '';
            case this.FieldTypes.DATE:
                return field.default || 'yyyy-MM-dd';
            case this.FieldTypes.NUMBER:
                return field.default || 0;
            case this.FieldTypes.BOOLEAN:
                return field.default || false;
            case this.FieldTypes.ARRAY:
                return field.default || [];
        }
    }

    componentWillReceiveProps(nextProps) {
        var formData = {};

        for (const field in nextProps.schema) {
            var defaultValue = this.getFieldDefault(nextProps.schema[field]);
            if (defaultValue !== undefined) {
                formData[field] = defaultValue;
            }
        }

        this.setState({
            formData: {
                ...this.state.formData,
                ...formData
            }
        });
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
            const field = this.props.schema[name];

            this.setState(
                {
                    formData: {
                        ...this.state.formData,
                        [name]: selection
                            ? field.type === this.FieldTypes.ARRAY
                              ? selection
                              : selection.value
                            : this.getFieldDefault(field)
                    }
                },
                this.changeCompletion
            );
        };
    }

    validateFields() {
        const errors = [];
        const formData = this.state.formData;
        for (const key in this.props.schema) {
            var field = this.props.schema[key];
            if (!field.required) {
                continue;
            }

            switch (field.type) {
                case this.FieldTypes.TEXT:
                case this.FieldTypes.ESSAY:
                case this.FieldTypes.SELECT:
                case this.FieldTypes.LINK:
                    if (formData[field.key] === '') {
                        errors.push(field.key);
                    }
                    break;
                case this.FieldTypes.DATE:
                    if (isNaN(new Date(formData[field.key]).getTime())) {
                        errors.push(field.key);
                    }
                    break;
                case this.FieldTypes.ARRAY:
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
        for (const key in this.props.schema) {
            var field = this.props.schema[key];

            switch (field.type) {
                case this.FieldTypes.TEXT:
                case this.FieldTypes.ESSAY:
                case this.FieldTypes.LINK:
                case this.FieldTypes.NUMBER:
                case this.FieldTypes.BOOLEAN:
                    formatted[key] = formData[key];
                    break;
                case this.FieldTypes.DATE:
                    formatted[key] = new Date(formData[key]);
                    break;
                case this.FieldTypes.SELECT:
                    formatted[key] = formData[key];
                    break;
                case this.FieldTypes.ARRAY:
                    formatted[key] = formData[key].map(obj => obj.label);
            }
        }

        return formatted;
    }

    render() {
        const formData = this.state.formData;
        return !this.props.schema
            ? null
            : <form onSubmit={this.onSubmit}>
                  {this.state.errorFields.length > 0
                      ? <AlertContainer>
                            <Alert message="Missing some required fields!" />
                        </AlertContainer>
                      : null}
                  {Object.keys(this.props.schema)
                      .filter(field => {
                          return !this.props.hidden[field.key];
                      })
                      .map(field => {
                          var fieldKey = field;
                          field = this.props.schema[field];
                          field.key = fieldKey;
                          switch (field.type) {
                              case this.FieldTypes.SELECT:
                                  return this.renderLabeledInput(
                                      field,
                                      <Select
                                          name={field.key}
                                          value={formData[field.key]}
                                          options={field.select}
                                          onChange={this.handleSelectChange(
                                              field.key
                                          )}
                                      />
                                  );
                              case this.FieldTypes.ARRAY:
                                  return this.renderLabeledInput(
                                      field,
                                      <Select
                                          name={field.key}
                                          value={formData[field.key]}
                                          options={field.array_select}
                                          multi={true}
                                          onChange={this.handleSelectChange(
                                              field.key
                                          )}
                                      />
                                  );
                              case this.FieldTypes.LINK:
                              case this.FieldTypes.TEXT:
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
                              case this.FieldTypes.NUMBER:
                                  return this.renderLabeledInput(
                                      field,
                                      <Input
                                          name={field.key}
                                          type="number"
                                          value={formData[field.key]}
                                          onChange={this.handleAttributeChange}
                                      />
                                  );
                              case this.FieldTypes.DATE:
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
                              case this.FieldTypes.SECTIONHEADER:
                                  return (
                                      <SectionHeader
                                          color={this.props.theme.primary}
                                          key={field.label}
                                      >
                                          {field.label}
                                      </SectionHeader>
                                  );
                              case this.FieldTypes.SUBMIT:
                                  return (
                                      <RoundedButton
                                          type="submit"
                                          color={this.props.theme.primary}
                                          key={field.label}
                                      >
                                          {field.label}
                                      </RoundedButton>
                                  );
                              case this.FieldTypes.BOOLEAN:
                                  return this.renderLabeledInput(
                                      field,
                                      <Select
                                          name={field.key}
                                          value={formData[field.key]}
                                          options={[
                                              {
                                                  value: 'yes',
                                                  label: 'Yes'
                                              },
                                              {
                                                  value: 'no',
                                                  label: 'No'
                                              }
                                          ]}
                                          onChange={this.handleSelectChange(
                                              field.key
                                          )}
                                      />
                                  );
                              case this.FieldTypes.ESSAY:
                                  return this.renderLabeledInput(
                                      field,
                                      <TextArea
                                          name={field.key}
                                          value={formData[field.key]}
                                          placeholder={field.placeholder}
                                          onChange={this.handleAttributeChange}
                                      />
                                  );
                          }
                      })}
              </form>;
    }
}

MHForm.defaultProps = {
    hidden: {},
    FieldTypes: {
        TEXT: 0,
        LINK: 1,
        DATE: 2,
        SELECT: 3,
        NUMBER: 4,
        ESSAY: 5,
        BOOLEAN: 6,
        SECTIONHEADER: 7,
        BUFFER: 8,
        ARRAY: 9,
        SUBMIT: 10
    }
};

export default MHForm;
