import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ApplicationThunks } from '../actions';
import {
    PageContainer,
    RoundedButton,
    FileUpload,
    Alert,
    Input,
    LabeledInput,
    LabeledTextarea
} from '../components';
import {
    FieldTypes,
    ProfileFields,
    HackerApplicationFields
} from '../constants/forms';

import Autocomplete from 'react-autocomplete';
import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';

const StyledSelect = styled.select`
    background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNC45NSIgaGVpZ2h0PSIxMCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxLjQxIDQuNjcgMi40OCAzLjE4IDMuNTQgNC42NyAxLjQxIDQuNjciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMy41NCA1LjMzIDIuNDggNi44MiAxLjQxIDUuMzMgMy41NCA1LjMzIi8+PC9zdmc+)
        no-repeat 95% 50%;
    padding-left: 10px;
    appearance: none;
    border-color: rgb(215, 215, 215);
    flex-grow: 1;
    height: 36px;
    width: 100%;
`;

const FormContainer = styled.div`
    max-width: 500px;
    margin: 0 auto;
    min-height: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 20px 50px 20px;
`;

const Flexer = styled.div`
    display: flex;
    flex-direction: column;
`;

const InputContainer = styled.div`
    margin: 20px 0 30px 0;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const SectionHeader = styled.h2`
    font-size: 40px;
    color: ${props => props.color};
    font-weight: 500;
    margin: 0;
`;

const FileUploadContainer = styled.div`
    margin-top: 30px;
`;

const SubsectionHeader = styled.h3`
    font-size: 22px;
    color: ${props => props.color};
    font-weight: 500;
    margin: 26px 0 0 0;
`;

const AlertContainer = styled.div`
    margin-top: 30px;
`;

const LegalText = styled.p`
    font-size: 15px;
    color: gray;
`;

const LegalLink = styled.a`
    color: ${props => props.theme.highlight};
    text-decoration: none;
`;

const Subhead = styled.p`
    margin: 20px 0 0 0;
    color: ${props => props.theme.secondary};
`;

const autocompleteMenuStyle = {
    borderRadius: '3px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '2px 0',
    fontSize: '90%',
    position: 'absolute',
    maxHeight:
        Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
        ) /
            2 +
        'px',
    left: '20px',
    top: '45px',
    overflow: 'auto',
    zIndex: 101
};

const autocompleteWrapperStyle = {
    display: 'inherit',
    width: '100%',
    position: 'relative'
};

class Apply extends React.Component {
    constructor(props) {
        super(props);

        const userData = this.props.userState.data.user;
        const appData = this.props.userState.data.app || {};

        this.state = {
            birthday: userData.birthday
                ? new Date(userData.birthday).toISOString().split('T')[0]
                : '',
            university: userData.university || '',
            major: userData.major || '',
            tshirt: userData.tshirt || 'm',
            hackathonExperience: userData.hackathonExperience || 'novice',
            resume: null,
            isResumeUploaded: userData.isResumeUploaded || false,
            notifications: OrderedSet()
        };

        for (const key of Object.keys(ProfileFields)) {
            if (
                ProfileFields[key] === FieldTypes.TEXT ||
                ProfileFields[key] === FieldTypes.LINK
            ) {
                this.state[key] = userData[key] || '';
            } else if (ProfileFields[key] === FieldTypes.SELECT) {
                this.state[key] = userData[key] || 'unselected';
            } else if (ProfileFields[key] === FieldTypes.DATE) {
                this.state[key] = userData[key]
                    ? new Date(userData[key]).toISOString().split('T')[0]
                    : '';
            }
        }

        for (const field of HackerApplicationFields) {
            if (!Object.keys(ProfileFields).includes(field.key)) {
                if (
                    field.type === FieldTypes.TEXT ||
                    field.type === FieldTypes.ESSAY
                ) {
                    this.state[field.key] = appData[field.key] || '';
                } else if (field.type === FieldTypes.SELECT) {
                    this.state[field.key] =
                        appData[field.key] || field.values[0].key;
                } else if (field.type === FieldTypes.INTEGER) {
                    this.state[field.key] = appData[field.key] || 0;
                }
            }
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleSortItems = this.handleSortItems.bind(this);
        this.handleItemShouldRender = this.handleItemShouldRender.bind(this);
        this.handleRenderMenu = this.handleRenderMenu.bind(this);
        this.defaultHandleRenderMenu = this.defaultHandleRenderMenu.bind(this);

        this.validationErrors = [];
    }

    addNotification(message, key, action) {
        return this.setState({
            notifications: this.state.notifications.add({
                message,
                key,
                action: action || 'Dismiss',
                onClick: (notification, deactivate) => {
                    deactivate();
                    this.removeNotification(key);
                },
                dismissAfter: 5000
            })
        });
    }

    removeNotification(key) {
        this.setState({
            notifications: this.state.notifications.filter(n => n.key !== key)
        });
    }

    componentDidMount() {
        this.props.dispatch(ApplicationThunks.loadApplication());
    }

    componentWillReceiveProps(nextProps) {
        const userData = this.props.userState.data.app;
        const nextUserData = nextProps.userState.data.app;

        if (nextProps.userState.fetching) {
            return;
        }

        var updateData = {};
        for (var i in nextUserData) {
            if (
                (userData &&
                    (i in userData && nextUserData[i] !== userData[i])) ||
                (userData && !(i in userData))
            ) {
                if (i === 'birthday') {
                    nextUserData[i] = nextUserData.birthday
                        ? new Date(nextUserData.birthday)
                              .toISOString()
                              .split('T')[0]
                        : '';
                }

                updateData[i] = nextUserData[i];
            }
        }

        if (!('isResumeUploaded' in updateData)) {
            updateData.isResumeUploaded = false;
        }

        this.setState(updateData);
    }

    // Generic function for changing state
    // -- input using this must have a name attribute
    handleAttributeChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleFileUpload(file) {
        this.setState({
            resume: file
        });
    }

    handleSortItems(a, b, value) {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const valueLower = value.toLowerCase();
        const queryPosA = aLower.indexOf(valueLower);
        const queryPosB = bLower.indexOf(valueLower);
        if (queryPosA !== queryPosB) {
            return queryPosA - queryPosB;
        }
        return aLower < bLower ? -1 : 1;
    }

    handleItemShouldRender(current, value) {
        return current.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    }

    handleRenderMenu(items, value, style) {
        return (
            <div
                style={{ ...style, ...autocompleteMenuStyle }}
                children={
                    value.length > 2 ? items : 'Start typing for autocomplete'
                }
            />
        );
    }

    defaultHandleRenderMenu(items, value, style) {
        return (
            <div
                style={{ ...style, ...autocompleteMenuStyle }}
                children={items}
            />
        );
    }

    onSubmit(e) {
        e.preventDefault();

        var application = {};
        var files = {};

        for (const field of HackerApplicationFields) {
            if (
                field.type === FieldTypes.TEXT ||
                field.type === FieldTypes.LINK ||
                field.type === FieldTypes.SELECT ||
                field.type === FieldTypes.INTEGER ||
                field.type === FieldTypes.ESSAY
            ) {
                application[field.key] = this.state[field.key];
            } else if (field.type === FieldTypes.DATE) {
                application[field.key] = new Date(
                    this.state[field.key]
                ).getTime();
            }
        }

        if (this.state.resume) {
            application.resume = this.state.resume;
        }

        this.props.dispatch(
            ApplicationThunks.uploadApplication(application, files)
        );

        this.addNotification('Application Saved!', 'save');
    }

    checkError(key) {
        return this.validationErrors.indexOf(key) !== -1;
    }

    addError(key) {
        if (!this.checkError(key)) {
            this.validationErrors.push(key);
        }
        this.removeError(null);
    }

    removeError(key) {
        var errorIndex = this.validationErrors.indexOf(key);
        if (errorIndex !== -1) {
            this.validationErrors.splice(errorIndex, 1);
        }

        var self = this;

        this.validationErrors.forEach(function(key, elem) {
            if (self.state[key]) {
                self.validationErrors.splice(elem, 1);
            }
        });
    }

    render() {
        const app = this.props.userState.data.app;

        return (
            <PageContainer>
                <FormContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        Application
                    </SectionHeader>
                    <form onSubmit={this.onSubmit}>
                        {this.props.userState.error ? (
                            <AlertContainer>
                                <Alert message={this.props.userState.message} />
                            </AlertContainer>
                        ) : null}
                        {this.props.userState.data.isApplicationSubmitted ? (
                            <AlertContainer>
                                <Alert
                                    message={
                                        'Your application is submitted but you can make changes on this page and update your application! Thanks for applying to MHacks X.'
                                    }
                                    positive={true}
                                />
                            </AlertContainer>
                        ) : null}
                        <Subhead>
                            Apply for MHacks X! MHacks X will be held on the
                            University of Michigan's North Campus in Ann Arbor
                            from September 22nd to 24th. If you already have
                            teammates in mind, include their names and emails in
                            the "anything else" question.
                        </Subhead>
                        <Flexer>
                            <div>
                                <InputContainer>
                                    {HackerApplicationFields.map(field => {
                                        if (
                                            (field.key === 'departing_from' ||
                                                field.key ===
                                                    'requested_reimbursement') &&
                                            this.state.needs_reimbursement ===
                                                'n'
                                        ) {
                                            return;
                                        }

                                        switch (field.type) {
                                            case FieldTypes.TEXT:
                                            case FieldTypes.LINK:
                                                return (
                                                    <div key={field.key}>
                                                        <LabeledInput
                                                            label={
                                                                field.label +
                                                                (field.required
                                                                    ? '*'
                                                                    : '')
                                                            }
                                                            labelWidth={
                                                                field.wideLabel
                                                                    ? '150px'
                                                                    : '100px'
                                                            }
                                                            key={field.key}
                                                        >
                                                            {field.autocomplete ? (
                                                                <Autocomplete
                                                                    getItemValue={item =>
                                                                        item
                                                                    }
                                                                    items={
                                                                        field.autocomplete
                                                                    }
                                                                    shouldItemRender={
                                                                        this
                                                                            .handleItemShouldRender
                                                                    }
                                                                    renderItem={(
                                                                        item,
                                                                        isHighlighted
                                                                    ) => (
                                                                        <div
                                                                            style={{
                                                                                background: isHighlighted
                                                                                    ? 'lightgray'
                                                                                    : 'white'
                                                                            }}
                                                                        >
                                                                            {
                                                                                item
                                                                            }
                                                                        </div>
                                                                    )}
                                                                    inputProps={{
                                                                        placeholder:
                                                                            field.placeholder,
                                                                        name:
                                                                            field.key,
                                                                        id:
                                                                            field.key,
                                                                        style: {
                                                                            height:
                                                                                '36px',
                                                                            width:
                                                                                '100%',
                                                                            paddingLeft:
                                                                                '10px',
                                                                            border:
                                                                                '1px solid #ccc',
                                                                            borderRadius:
                                                                                '4px'
                                                                        }
                                                                    }}
                                                                    sortItems={
                                                                        this
                                                                            .handleSortItems
                                                                    }
                                                                    value={
                                                                        this
                                                                            .state[
                                                                            field
                                                                                .key
                                                                        ]
                                                                    }
                                                                    onChange={e => {
                                                                        if (
                                                                            !e
                                                                                .target
                                                                                .value &&
                                                                            field.required
                                                                        ) {
                                                                            this.addError(
                                                                                field.key
                                                                            );
                                                                        } else {
                                                                            this.removeError(
                                                                                field.key
                                                                            );
                                                                        }

                                                                        this.handleAttributeChange(
                                                                            e
                                                                        );
                                                                    }}
                                                                    onSelect={e => {
                                                                        var fakeEvent = {
                                                                            target: {
                                                                                name:
                                                                                    field.key,
                                                                                value: e
                                                                            }
                                                                        };

                                                                        if (
                                                                            !fakeEvent
                                                                                .target
                                                                                .value &&
                                                                            field.required
                                                                        ) {
                                                                            this.addError(
                                                                                field.key
                                                                            );
                                                                        } else {
                                                                            this.removeError(
                                                                                field.key
                                                                            );
                                                                        }

                                                                        this.handleAttributeChange(
                                                                            fakeEvent
                                                                        );
                                                                    }}
                                                                    menuStyle={
                                                                        autocompleteMenuStyle
                                                                    }
                                                                    wrapperStyle={
                                                                        autocompleteWrapperStyle
                                                                    }
                                                                    renderMenu={
                                                                        field.key ===
                                                                        'university'
                                                                            ? this
                                                                                  .handleRenderMenu
                                                                            : this
                                                                                  .defaultHandleRenderMenu
                                                                    }
                                                                />
                                                            ) : (
                                                                <Input
                                                                    id={
                                                                        field.key
                                                                    }
                                                                    type="text"
                                                                    name={
                                                                        field.key
                                                                    }
                                                                    placeholder={
                                                                        field.placeholder
                                                                    }
                                                                    value={
                                                                        this
                                                                            .state[
                                                                            field
                                                                                .key
                                                                        ]
                                                                    }
                                                                    onChange={e => {
                                                                        if (
                                                                            !e
                                                                                .target
                                                                                .value &&
                                                                            field.required
                                                                        ) {
                                                                            this.addError(
                                                                                field.key
                                                                            );
                                                                        } else {
                                                                            this.removeError(
                                                                                field.key
                                                                            );
                                                                        }

                                                                        this.handleAttributeChange(
                                                                            e
                                                                        );
                                                                    }}
                                                                />
                                                            )}
                                                        </LabeledInput>
                                                        {(!this.state[
                                                            field.key
                                                        ] &&
                                                            field.required) ||
                                                        this.checkError(
                                                            field.key
                                                        ) ? (
                                                            <AlertContainer>
                                                                {this.addError(
                                                                    field.key
                                                                )}
                                                                <Alert
                                                                    message={
                                                                        'The field above is required'
                                                                    }
                                                                />
                                                            </AlertContainer>
                                                        ) : (
                                                            this.removeError(
                                                                field.key
                                                            )
                                                        )}
                                                    </div>
                                                );
                                            case FieldTypes.ESSAY:
                                                return (
                                                    <LabeledTextarea
                                                        label={
                                                            field.label +
                                                            (field.required
                                                                ? '*'
                                                                : '')
                                                        }
                                                        key={field.key}
                                                    >
                                                        <textarea
                                                            id={field.key}
                                                            name={field.key}
                                                            placeholder={
                                                                field.placeholder
                                                            }
                                                            value={
                                                                this.state[
                                                                    field.key
                                                                ]
                                                            }
                                                            onChange={e => {
                                                                if (
                                                                    !e.target
                                                                        .value &&
                                                                    field.required
                                                                ) {
                                                                    this.addError(
                                                                        field.key
                                                                    );
                                                                } else {
                                                                    this.removeError(
                                                                        field.key
                                                                    );
                                                                }

                                                                this.handleAttributeChange(
                                                                    e
                                                                );
                                                            }}
                                                        />
                                                        {(!this.state[
                                                            field.key
                                                        ] &&
                                                            field.required) ||
                                                        this.checkError(
                                                            field.key
                                                        ) ? (
                                                            <AlertContainer>
                                                                {this.addError(
                                                                    field.key
                                                                )}
                                                                <Alert
                                                                    message={
                                                                        'The field above is required'
                                                                    }
                                                                />
                                                            </AlertContainer>
                                                        ) : (
                                                            this.removeError(
                                                                field.key
                                                            )
                                                        )}
                                                    </LabeledTextarea>
                                                );
                                            case FieldTypes.DATE:
                                                return (
                                                    <div key={field.key}>
                                                        <LabeledInput
                                                            label={
                                                                field.label +
                                                                (field.required
                                                                    ? '*'
                                                                    : '')
                                                            }
                                                            labelWidth={
                                                                field.wideLabel
                                                                    ? '150px'
                                                                    : '100px'
                                                            }
                                                            key={field.key}
                                                        >
                                                            <Input
                                                                id={field.key}
                                                                type="date"
                                                                name={field.key}
                                                                placeholder={
                                                                    field.placeholder
                                                                }
                                                                value={
                                                                    this.state[
                                                                        field
                                                                            .key
                                                                    ]
                                                                }
                                                                onChange={e => {
                                                                    if (
                                                                        !e
                                                                            .target
                                                                            .value &&
                                                                        field.required
                                                                    ) {
                                                                        this.addError(
                                                                            field.key
                                                                        );
                                                                    } else {
                                                                        this.removeError(
                                                                            field.key
                                                                        );
                                                                    }

                                                                    this.handleAttributeChange(
                                                                        e
                                                                    );
                                                                }}
                                                            />
                                                        </LabeledInput>
                                                        {!this.state[
                                                            field.key
                                                        ] && field.required ? (
                                                            <AlertContainer>
                                                                {this.addError(
                                                                    field.key
                                                                )}
                                                                <Alert
                                                                    message={
                                                                        'The field above is required'
                                                                    }
                                                                />
                                                            </AlertContainer>
                                                        ) : (
                                                            this.removeError(
                                                                field.key
                                                            )
                                                        )}
                                                    </div>
                                                );
                                            case FieldTypes.INTEGER:
                                                return (
                                                    <div key={field.key}>
                                                        <LabeledInput
                                                            label={
                                                                field.label +
                                                                (field.required
                                                                    ? '*'
                                                                    : '')
                                                            }
                                                            labelWidth={
                                                                field.wideLabel
                                                                    ? '150px'
                                                                    : '100px'
                                                            }
                                                            key={field.key}
                                                        >
                                                            <Input
                                                                id={field.key}
                                                                type="number"
                                                                name={field.key}
                                                                value={
                                                                    this.state[
                                                                        field
                                                                            .key
                                                                    ]
                                                                }
                                                                onChange={e => {
                                                                    if (
                                                                        !e
                                                                            .target
                                                                            .value &&
                                                                        field.required
                                                                    ) {
                                                                        this.addError(
                                                                            field.key
                                                                        );
                                                                    } else {
                                                                        this.removeError(
                                                                            field.key
                                                                        );
                                                                    }

                                                                    this.handleAttributeChange(
                                                                        e
                                                                    );
                                                                }}
                                                            />
                                                        </LabeledInput>
                                                        {(!this.state[
                                                            field.key
                                                        ] &&
                                                            field.required) ||
                                                        this.checkError(
                                                            field.key
                                                        ) ? (
                                                            <AlertContainer>
                                                                {this.addError(
                                                                    field.key
                                                                )}
                                                                <Alert
                                                                    message={
                                                                        'The field above is required'
                                                                    }
                                                                />
                                                            </AlertContainer>
                                                        ) : (
                                                            this.removeError(
                                                                field.key
                                                            )
                                                        )}
                                                    </div>
                                                );
                                            case FieldTypes.SELECT:
                                                return (
                                                    <div key={field.key}>
                                                        <LabeledInput
                                                            label={
                                                                field.label +
                                                                (field.required
                                                                    ? '*'
                                                                    : '')
                                                            }
                                                            labelWidth={
                                                                field.wideLabel
                                                                    ? '150px'
                                                                    : '100px'
                                                            }
                                                            key={field.key}
                                                        >
                                                            <StyledSelect
                                                                name={field.key}
                                                                value={
                                                                    this.state[
                                                                        field
                                                                            .key
                                                                    ]
                                                                }
                                                                onChange={e => {
                                                                    if (
                                                                        !e
                                                                            .target
                                                                            .value &&
                                                                        field.required
                                                                    ) {
                                                                        this.addError(
                                                                            field.key
                                                                        );
                                                                    } else {
                                                                        this.removeError(
                                                                            field.key
                                                                        );
                                                                    }

                                                                    this.handleAttributeChange(
                                                                        e
                                                                    );
                                                                }}
                                                            >
                                                                {field.values.map(
                                                                    tuple => {
                                                                        return (
                                                                            <option
                                                                                value={
                                                                                    tuple.key
                                                                                }
                                                                                key={
                                                                                    tuple.key
                                                                                }
                                                                            >
                                                                                {
                                                                                    tuple.value
                                                                                }
                                                                            </option>
                                                                        );
                                                                    }
                                                                )}
                                                            </StyledSelect>
                                                        </LabeledInput>
                                                        {(!this.state[
                                                            field.key
                                                        ] &&
                                                            field.required) ||
                                                        (this.state[
                                                            field.key
                                                        ] === 'unselected' &&
                                                            field.required) ||
                                                        this.checkError(
                                                            field.key
                                                        ) ? (
                                                            <AlertContainer>
                                                                {this.addError(
                                                                    field.key
                                                                )}
                                                                <Alert
                                                                    message={
                                                                        'The field above is required'
                                                                    }
                                                                />
                                                            </AlertContainer>
                                                        ) : (
                                                            this.removeError(
                                                                field.key
                                                            )
                                                        )}
                                                    </div>
                                                );
                                            case FieldTypes.SECTIONHEADER:
                                                return (
                                                    <SubsectionHeader
                                                        color={
                                                            this.props.theme
                                                                .primary
                                                        }
                                                        key={field.title}
                                                    >
                                                        {field.title}
                                                    </SubsectionHeader>
                                                );
                                        }
                                    })}
                                    <FileUploadContainer>
                                        <FileUpload
                                            fileTitle="Resume"
                                            defaultColor={
                                                app && app.resume
                                                    ? this.props.theme.success
                                                    : this.props.theme.primary
                                            }
                                            hoverColor={
                                                this.props.theme.secondary
                                            }
                                            activeColor={
                                                this.props.theme.success
                                            }
                                            onFileSelect={e => {
                                                if (e) {
                                                    this.removeError(
                                                        'choosefile'
                                                    );
                                                } else {
                                                    this.addError('choosefile');
                                                }

                                                this.handleFileUpload(e);
                                            }}
                                            defaultText={
                                                app && app.resume
                                                    ? 'Resume Uploaded'
                                                    : null
                                            }
                                        />

                                        {(app && app.resume) ||
                                        this.state.resume
                                            ? this.removeError('choosefile')
                                            : this.addError('choosefile')}

                                        {(!(app && app.resume) &&
                                            !this.state.resume) ||
                                        this.checkError('choosefile') ? (
                                            <AlertContainer>
                                                {this.addError('choosefile')}
                                                <Alert
                                                    message={
                                                        'The field above is required'
                                                    }
                                                />
                                            </AlertContainer>
                                        ) : (
                                            this.removeError('choosefile')
                                        )}
                                    </FileUploadContainer>
                                </InputContainer>
                                <ButtonGroup>
                                    <RoundedButton
                                        type="submit"
                                        color={this.props.theme.primary}
                                        disabled={
                                            this.validationErrors.length > 0
                                        }
                                        style={
                                            this.validationErrors.length > 0
                                                ? {
                                                      backgroundColor: this
                                                          .props.theme.secondary
                                                  }
                                                : {}
                                        }
                                        hover={
                                            this.validationErrors.length > 0
                                                ? 'color: ' +
                                                  this.props.theme.primary
                                                : ''
                                        }
                                    >
                                        {this.validationErrors.length > 0
                                            ? `${
                                                  this.validationErrors.length
                                              } Error(s)`
                                            : 'Save'}
                                    </RoundedButton>
                                </ButtonGroup>
                                <LegalText>
                                    By applying to MHacks X, you agree to the
                                    MHacks{' '}
                                    <LegalLink href="https://docs.google.com/document/d/1L9wC7lfXmOBCKdUQancuoYQf86KIQqUJ0is4dr8QqQM/pub">
                                        Code of Conduct
                                    </LegalLink>.
                                </LegalText>
                            </div>
                        </Flexer>
                    </form>
                </FormContainer>
                <NotificationStack
                    notifications={this.state.notifications.toArray()}
                    onDismiss={notification =>
                        this.setState({
                            notifications: this.state.notifications.delete(
                                notification
                            )
                        })
                    }
                />
            </PageContainer>
        );
    }
}

Apply.contextTypes = {
    router: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Apply);
