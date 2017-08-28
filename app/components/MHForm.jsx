import React from 'react';
import styled from 'styled-components';
import LabeledInput from './LabeledInput.jsx';
import RoundedButton from './RoundedButton.jsx';
import FileUpload from './FileUpload';
import Alert from './Alert.jsx';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';

const FileUploadContainer = styled.div`margin: 10px 0;`;

const AlertContainer = styled.div`marginTop: 30px;`;

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
    border: 1px solid ${props => (props.hasError ? 'red' : '#ccc')};
    borderRadius: 4px;
`;

const TextArea = styled.textarea`
    padding: 10px;
    borderColor: ${props => (props.hasError ? 'red' : 'rgb(215, 215, 215)')};
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
            formData: {},
            files: {}
        };

        this.FieldTypes = props.FieldTypes;

        for (const field in props.schema) {
            const defaultValue = this.getFieldDefault(props.schema[field]);
            if (defaultValue !== undefined) {
                if (props.schema[field].type === props.FieldTypes.FILE) {
                    initialState.files[field] = defaultValue;
                } else {
                    initialState.formData[field] = defaultValue;
                }
            }
        }

        this.state = initialState;
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.handleFileUploadForKey = this.handleFileUploadForKey.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.changeCompletion = this.changeCompletion.bind(this);
    }

    defaultForType(type) {
        switch (type) {
            case this.FieldTypes.TEXT:
            case this.FieldTypes.ESSAY:
            case this.FieldTypes.SELECT:
            case this.FieldTypes.FILE:
            case this.FieldTypes.LINK:
                return '';
            case this.FieldTypes.DATE: {
                return 'yyyy-MM-dd';
            }
            case this.FieldTypes.NUMBER:
                return 0;
            case this.FieldTypes.BOOLEAN:
                return false;
            case this.FieldTypes.ARRAY:
                return [];
            case this.FieldTypes.SECTIONHEADER:
            case this.FieldTypes.SUBMIT:
                return undefined;
            default:
                console.error(
                    'Field Type ' +
                        type +
                        ' not defined, behavior is undefined!'
                );
        }
    }

    getFieldDefault(field) {
        const defaultValue = this.defaultForType(field.type);

        switch (field.type) {
            case this.FieldTypes.TEXT:
            case this.FieldTypes.ESSAY:
            case this.FieldTypes.SELECT:
            case this.FieldTypes.FILE:
            case this.FieldTypes.LINK:
                return field.default || defaultValue;
            case this.FieldTypes.DATE: {
                const date = new Date(field.default);
                if (isNaN(date.getTime())) {
                    return defaultValue;
                }

                return date.toISOString().split('T')[0];
            }
            case this.FieldTypes.NUMBER:
                return field.default || defaultValue;
            case this.FieldTypes.BOOLEAN:
                return field.default || defaultValue;
            case this.FieldTypes.ARRAY:
                return field.default || defaultValue;
            case this.FieldTypes.SECTIONHEADER:
            case this.FieldTypes.SUBMIT:
                return defaultValue;
            default:
                console.error('Field Type not defined, behavior is undefined!');
                return defaultValue;
        }
    }

    componentWillReceiveProps(nextProps) {
        const formData = {};
        const files = {};

        for (const field in nextProps.schema) {
            const defaultValue = this.getFieldDefault(nextProps.schema[field]);

            if (
                nextProps.schema[field].type === this.FieldTypes.FILE &&
                defaultValue !== undefined &&
                (!this.state.files.hasOwnProperty(field) ||
                    this.state.files[field] === undefined ||
                    this.state.files[field] ===
                        this.defaultForType(nextProps.schema[field].type))
            ) {
                files[field] = defaultValue;
            } else if (
                defaultValue !== undefined &&
                (!this.state.formData.hasOwnProperty(field) ||
                    this.state.formData[field] === undefined ||
                    this.state.formData[field] ===
                        this.defaultForType(nextProps.schema[field].type))
            ) {
                formData[field] = defaultValue;
            }
        }

        this.setState({
            formData: {
                ...this.state.formData,
                ...formData
            },
            files: {
                ...this.state.files,
                ...files
            }
        });
    }

    changeCompletion() {
        if (this.props.onChange) {
            this.props.onChange(this.formatFormData(), this.formatFiles());
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

    handleFileUploadForKey(key) {
        return file => {
            this.setState(
                {
                    files: {
                        ...this.state.files,
                        [key]: file
                    }
                },
                this.changeCompletion
            );
        };
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
        const { formData, files } = this.state;
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
                    if (formData[field.key].length < 1) {
                        errors.push(field.key);
                    }
                    break;
                case this.FieldTypes.FILE:
                    if (files[field.key] === '') {
                        errors.push(field.key);
                    }
            }
        }

        return errors;
    }

    renderLabeledInput(field, contents, hasError = false) {
        return (
            <LabeledInput
                label={field.label}
                required={field.required || false}
                key={field.key}
                hasError={hasError}
            >
                {contents}
            </LabeledInput>
        );
    }

    onSubmit(e) {
        e.preventDefault();
        const errorFields = this.validateFields();

        if (errorFields.length === 0) {
            this.props.onSubmit(this.formatFormData(), this.formatFiles());
        }

        this.setState({
            errorFields
        });
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
                    formatted[key] = new Date(
                        new Date(formData[key]).toISOString().split('T')[0]
                    ).getTime();
                    break;
                case this.FieldTypes.SELECT:
                    if (
                        !field.required &&
                        formData[key] === '' &&
                        field.select.length > 0
                    ) {
                        // Assume default value (which should be unselected) if unselected.
                        formatted[key] = field.select[0].value;
                    } else {
                        formatted[key] = formData[key];
                    }
                    break;
                case this.FieldTypes.ARRAY:
                    formatted[key] = formData[key].map(obj => obj.label);
            }
        }

        return formatted;
    }

    formatFiles() {
        const formatted = {};
        const files = this.state.files;
        for (const key in this.props.schema) {
            var field = this.props.schema[key];

            if (
                field.type === this.FieldTypes.FILE &&
                files[key] &&
                typeof files[key] === 'object'
            ) {
                formatted[key] = files[key];
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
                      .map(fieldKey => {
                          const hasError = this.state.errorFields.includes(
                              fieldKey
                          );
                          const field = this.props.schema[fieldKey];
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
                                      />,
                                      hasError
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
                                      />,
                                      hasError
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
                                          hasError={hasError}
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
                                          hasError={hasError}
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
                                          hasError={hasError}
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
                              case this.FieldTypes.FILE: {
                                  const uploadBackground = hasError
                                      ? 'red'
                                      : this.state.files[field.key]
                                        ? this.props.theme.success
                                        : this.props.theme.primary;
                                  return (
                                      <FileUploadContainer key={field.label}>
                                          <FileUpload
                                              defaultColor={uploadBackground}
                                              hoverColor={
                                                  this.props.theme.secondary
                                              }
                                              activeColor={
                                                  this.props.theme.success
                                              }
                                              onFileSelect={this.handleFileUploadForKey(
                                                  field.key
                                              )}
                                          />
                                      </FileUploadContainer>
                                  );
                              }
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
                                      />,
                                      hasError
                                  );
                              case this.FieldTypes.ESSAY:
                                  return this.renderLabeledInput(
                                      field,
                                      <TextArea
                                          name={field.key}
                                          value={formData[field.key]}
                                          placeholder={field.placeholder}
                                          onChange={this.handleAttributeChange}
                                          hasError={hasError}
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
        SUBMIT: 10,
        FILE: 11
    }
};

export default MHForm;
