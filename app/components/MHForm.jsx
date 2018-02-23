import React from 'react';
import styled from 'styled-components';
import LabeledInput from './LabeledInput.jsx';
import RoundedButton from './RoundedButton.jsx';
import FileUpload from './FileUpload';
import Alert from './Alert.jsx';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';

const FileUploadContainer = styled.div`
    margin: 10px 0;
`;

const AlertContainer = styled.div`
    margin-top: 30px;
`;

const SectionHeader = styled.h3`
    font-size: 22px;
    color: ${props => props.color};
    font-weight: 500;
    margin: 26px 0 0 0;
`;

const Input = styled.input`
    height: 36px;
    width: 100%;
    padding-left: 10px;
    border: 1px solid ${props => (props.hasError ? 'red' : '#ccc')};
    border-radius: 4px;
    font-size: 1em;
`;

const TextArea = styled.textarea`
    padding: 10px;
    border-color: ${props => (props.hasError ? 'red' : 'rgb(215, 215, 215)')};
    flex-grow: 1;
    height: 120px;
    width: 100%;
    border-radius: 5px;
    font-size: 1em;
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

        // This will only execute if the schema is hardcoded into frontend. In the typical case, this will not run because the schema is returned by backend.
        for (const key in props.schema) {
            const defaultValue =
                props.initialData[key] !== undefined
                    ? props.initialData[key]
                    : this.getFieldDefault(
                          key,
                          props.schema,
                          props.initialData
                      );

            if (defaultValue !== undefined) {
                if (props.schema[key].type === props.FieldTypes.FILE) {
                    initialState.files[key] = defaultValue;
                } else {
                    initialState.formData[key] = defaultValue;
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

    componentWillReceiveProps(nextProps) {
        const formData = {};
        const files = {};

        for (const key in nextProps.schema) {
            const fieldType = nextProps.schema[key].type;
            const defaultValue = this.getFieldDefault(
                key,
                nextProps.schema,
                nextProps.initialData
            );

            // Either modifies the files object (in the case of a file), or the formData object otherwise
            const existingObject =
                fieldType === this.FieldTypes.FILE
                    ? this.state.files
                    : this.state.formData;
            const editedObject =
                fieldType === this.FieldTypes.FILE ? files : formData;

            if (
                defaultValue !== undefined &&
                (!existingObject.hasOwnProperty(key) ||
                    existingObject[key] === undefined ||
                    existingObject[key] === this.defaultForType(fieldType))
            ) {
                editedObject[key] = defaultValue;
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

    defaultForType(type) {
        switch (type) {
            case this.FieldTypes.TEXT:
            case this.FieldTypes.ESSAY:
            case this.FieldTypes.SELECT:
            case this.FieldTypes.FILE:
            case this.FieldTypes.BOOLEAN:
            case this.FieldTypes.LINK:
            case this.FieldTypes.NUMBER:
                return '';
            case this.FieldTypes.DATE: {
                return 'yyyy-MM-dd';
            }
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

    // Given a key for a field, the schema, and optionally initialData, returns the value to populate
    // into the field by default, before user interaction.
    getFieldDefault(key, schema, initialData = {}) {
        // If real valid data is already available, use it.
        if (initialData[key] !== undefined) {
            return initialData[key];
        }

        const field = schema[key];
        const defaultForType = this.defaultForType(schema[key].type);

        switch (field.type) {
            case this.FieldTypes.TEXT:
            case this.FieldTypes.ESSAY:
            case this.FieldTypes.SELECT:
            case this.FieldTypes.FILE:
            case this.FieldTypes.LINK:
            case this.FieldTypes.NUMBER:
            case this.FieldTypes.BOOLEAN:
            case this.FieldTypes.ARRAY:
                return field.default !== undefined
                    ? field.default
                    : defaultForType;
            case this.FieldTypes.DATE: {
                const date = new Date(field.default);
                if (isNaN(date.getTime())) {
                    return defaultForType;
                }

                return date.toISOString().split('T')[0];
            }
            case this.FieldTypes.SECTIONHEADER:
            case this.FieldTypes.SUBMIT:
                return defaultForType;
            default:
                console.error('Field Type not defined, behavior is undefined!');
                return defaultForType;
        }
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
                            : this.getFieldDefault(
                                  name,
                                  this.props.schema,
                                  this.props.initialData
                              )
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
                case this.FieldTypes.BOOLEAN:
                case this.FieldTypes.LINK:
                case this.FieldTypes.NUMBER:
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
                    break;
                default:
                    console.error(
                        'Field Type not defined, behavior is undefined!'
                    );
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
                theme={this.props.theme}
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
                case this.FieldTypes.DATE: {
                    const formDate = new Date(formData[key]);
                    if (!isNaN(formDate.getTime())) {
                        formatted[key] = new Date(
                            formDate.toISOString().split('T')[0]
                        ).getTime();
                    }
                    break;
                }
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
                    formatted[key] = formData[key].map(obj => obj.value);
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
        return !this.props.schema ? null : (
            <form onSubmit={this.onSubmit}>
                {this.state.errorFields.length > 0 ? (
                    <AlertContainer>
                        <Alert message="Missing some required fields!" />
                    </AlertContainer>
                ) : null}
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
                                            fileTitle={field.label}
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
                                                value: true,
                                                label: 'Yes'
                                            },
                                            {
                                                value: false,
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
            </form>
        );
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
    },
    initialData: {}
};

export default MHForm;
