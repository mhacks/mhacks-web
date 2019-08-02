import React from 'react';
import styled from 'styled-components';
import LabeledInput from './LabeledInput.jsx';
import RoundedButton from './RoundedButton.jsx';
import FileUpload from './FileUpload';
import Alert from './Alert.jsx';
import Select from 'react-virtualized-select';
import { Creatable as ReactSelectCreatable } from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';
import 'react-select/dist/react-select.min.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';

class Creatable extends React.Component {
    render() {
        return <ReactSelectCreatable {...this.props} />;
    }
}

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
            files: {},
            cachedLoaders: {}
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

    componentDidMount() {
        this.UNSAFE_componentWillReceiveProps(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const formData = {};
        const files = {};
        const cachedLoaders = {};

        for (const key in nextProps.schema) {
            const fieldType = nextProps.schema[key].type;
            let defaultValue = this.getFieldDefault(
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

            if (
                (fieldType && fieldType === this.FieldTypes.SELECT) ||
                fieldType === this.FieldTypes.ARRAY
            ) {
                if (!this.state.cachedLoaders[key]) {
                    let options =
                        nextProps.schema[key].select ||
                        nextProps.schema[key].array_select;

                    if (Array.isArray(options) && options.length === 1) {
                        let self = this;
                        fetch(options[0].label)
                            .then(response => {
                                return response.json();
                            })
                            .then(json => {
                                if (defaultValue.indexOf('/v1/') === 0) {
                                    defaultValue = '';
                                    editedObject[key] = defaultValue;
                                }

                                const cachedLoaders = {};

                                cachedLoaders[key] = {};
                                cachedLoaders[key].options =
                                    json.form[
                                        options[0].label.split('/').pop()
                                    ].select;

                                let pulledOptions =
                                    json.form[options[0].label.split('/').pop()]
                                        .select;

                                pulledOptions.push({
                                    label: defaultValue,
                                    value: defaultValue
                                });

                                cachedLoaders[key].loader = createFilterOptions(
                                    {
                                        options: pulledOptions
                                    }
                                );

                                self.setState({
                                    formData: {
                                        ...self.state.formData,
                                        ...formData
                                    },
                                    files: {
                                        ...self.state.files,
                                        ...files
                                    },
                                    cachedLoaders: {
                                        ...self.state.cachedLoaders,
                                        ...cachedLoaders
                                    }
                                });
                            });
                    }

                    cachedLoaders[key] = {};
                    cachedLoaders[key].options = options;
                    cachedLoaders[key].loader = createFilterOptions({
                        options:
                            nextProps.schema[key].select ||
                            nextProps.schema[key].array_select
                    });

                    this.forceUpdate();
                }
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
            },
            cachedLoaders: {
                ...this.state.cachedLoaders,
                ...cachedLoaders
            }
        });
    }

    dateLocaleISO(date) {
        var pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
        return (
            date.getFullYear() +
            '-' +
            pad(date.getMonth() + 1) +
            '-' +
            pad(date.getDate()) +
            'T' +
            pad(date.getHours()) +
            ':' +
            pad(date.getMinutes()) +
            ':' +
            pad(date.getSeconds())
        );
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
            case this.FieldTypes.DATETIME: {
                return this.dateLocaleISO(new Date());
            }
            case this.FieldTypes.ARRAY:
                return [];
            case this.FieldTypes.SECTIONHEADER:
            case this.FieldTypes.SUBMIT:
            case undefined:
                return undefined;
            default:
                console.error(
                    'Field Type `' +
                        type +
                        '` is not defined, behavior is undefined!'
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
            case this.FieldTypes.DATETIME: {
                const date = new Date(field.default);
                if (isNaN(date.getTime())) {
                    return defaultForType;
                }

                return this.dateLocaleISO(date);
            }
            case this.FieldTypes.SECTIONHEADER:
            case this.FieldTypes.SUBMIT:
            case undefined:
                return defaultForType;
            default:
                console.error(
                    'Field Type `' +
                        field.type +
                        '` is not defined, behavior is undefined!'
                );
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
                    if (
                        formData[field.key] === '' ||
                        (field.required_value !== undefined &&
                            field.required_value !== formData[field.key])
                    ) {
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

        if (!this.props.validate) {
            return [];
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
            this.props.onSubmit(
                this.formatFormData(),
                this.formatFiles(),
                e,
                this.clicked
            );
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
                case this.FieldTypes.DATETIME: {
                    const formDate = new Date(formData[key]);
                    if (!isNaN(formDate.getTime())) {
                        formatted[key] = formDate.getTime();
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

                    if (formatted[key].indexOf('/v1/') === 0) {
                        formatted[key] = '';
                    }
                    break;
                case this.FieldTypes.ARRAY:
                    if (!Array.isArray(formData[key])) {
                        formData[key] = formData[key].split(' ');
                    }
                    formatted[key] = formData[key].map(obj => {
                        return typeof obj === 'object' ? obj.value : obj;
                    });
                    break;
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
                        let hidden = {};
                        if (!this.props.hidden_override) {
                            hidden = Object.assign(
                                {},
                                MHForm.defaultProps.hidden,
                                this.props.hidden
                            );
                        } else {
                            hidden = this.props.hidden;
                        }

                        return !hidden[field];
                    })
                    .map(fieldKey => {
                        const hasError = this.state.errorFields.includes(
                            fieldKey
                        );
                        const field = this.props.schema[fieldKey];
                        field.key = fieldKey;

                        if (field.depends_on && !formData[field.depends_on]) {
                            return null;
                        }

                        switch (field.type) {
                            case this.FieldTypes.SELECT:
                                return this.renderLabeledInput(
                                    field,
                                    <Select
                                        name={field.key}
                                        value={formData[field.key]}
                                        options={
                                            this.state.cachedLoaders[field.key]
                                                ? this.state.cachedLoaders[
                                                      field.key
                                                  ].options
                                                : []
                                        }
                                        onChange={this.handleSelectChange(
                                            field.key
                                        )}
                                        filterOptions={
                                            this.state.cachedLoaders[field.key]
                                                ? this.state.cachedLoaders[
                                                      field.key
                                                  ].loader
                                                : undefined
                                        }
                                        selectComponent={
                                            field.creatable
                                                ? Creatable
                                                : undefined
                                        }
                                    />,
                                    hasError
                                );
                            case this.FieldTypes.ARRAY:
                                return this.renderLabeledInput(
                                    field,
                                    <Select
                                        name={field.key}
                                        value={formData[field.key]}
                                        options={
                                            this.state.cachedLoaders[field.key]
                                                ? this.state.cachedLoaders[
                                                      field.key
                                                  ].options
                                                : []
                                        }
                                        multi={true}
                                        onChange={this.handleSelectChange(
                                            field.key
                                        )}
                                        filterOptions={
                                            this.state.cachedLoaders[field.key]
                                                ? this.state.cachedLoaders[
                                                      field.key
                                                  ].loader
                                                : undefined
                                        }
                                        selectComponent={
                                            field.creatable
                                                ? Creatable
                                                : undefined
                                        }
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
                            case this.FieldTypes.DATETIME:
                                return this.renderLabeledInput(
                                    field,
                                    <Input
                                        name={field.key}
                                        type="datetime-local"
                                        placeholder="yyyy-mm-ddTH:m:S"
                                        value={formData[field.key]}
                                        onChange={this.handleAttributeChange}
                                        hasError={hasError}
                                    />
                                );
                            case this.FieldTypes.SECTIONHEADER:
                                return (
                                    <SectionHeader
                                        color={this.props.theme.primary}
                                        key={field.key}
                                    >
                                        {field.label}
                                    </SectionHeader>
                                );
                            case this.FieldTypes.FILE: {
                                let notExists = true;
                                if (
                                    Array.isArray(this.state.files[field.key])
                                ) {
                                    for (const i in this.state.files[
                                        field.key
                                    ]) {
                                        if (
                                            this.state.files[field.key][i] &&
                                            this.state.files[field.key][i]
                                                .toLowerCase()
                                                .indexOf('/artifact/') !== -1
                                        ) {
                                            notExists = false;
                                        }
                                    }
                                }

                                if (
                                    typeof this.state.files[field.key] ===
                                        'string' &&
                                    this.state.files[field.key]
                                        .toLowerCase()
                                        .indexOf('/artifact/') !== -1
                                ) {
                                    notExists = false;
                                }

                                const uploadBackground = hasError
                                    ? 'red'
                                    : this.state.files[field.key] && !notExists
                                        ? this.props.theme.success
                                        : this.props.theme.primary;
                                return (
                                    <FileUploadContainer key={field.key}>
                                        <FileUpload
                                            fileTitle={field.label}
                                            defaultColor={uploadBackground}
                                            defaultText={
                                                this.state.files[field.key] &&
                                                !notExists
                                                    ? 'Uploaded. Click to change.'
                                                    : false
                                            }
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
                            case this.FieldTypes.SUBMIT: {
                                const errors = this.validateFields();

                                return (
                                    <RoundedButton
                                        type="submit"
                                        color={this.props.theme.primary}
                                        key={field.key}
                                        disabled={errors.length > 0}
                                        style={
                                            errors.length > 0
                                                ? {
                                                      backgroundColor: this
                                                          .props.theme.secondary
                                                  }
                                                : {}
                                        }
                                        hover={
                                            errors.length > 0
                                                ? 'color: ' +
                                                  this.props.theme.primary
                                                : ''
                                        }
                                        onClick={() =>
                                            (this.clicked = field.key)
                                        }
                                    >
                                        {errors.length > 0
                                            ? `${errors.length} Error(s)`
                                            : field.label}
                                    </RoundedButton>
                                );
                            }
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
    hidden: {
        delete_button: true,
        deleted: true,
        reader: true,
        status: true,
        email: true,
        password: true,
        user: true,
        score: true,
        reimbursement: true
    },
    hidden_override: false,
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
        FILE: 11,
        DATETIME: 12
    },
    initialData: {},
    validate: true
};

export default MHForm;
