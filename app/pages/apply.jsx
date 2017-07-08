import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ProfileThunks, ApplicationThunks } from '../actions';
import { routes } from '../constants';
import {
    PageContainer,
    RoundedButton,
    FileUpload,
    Alert,
    LabeledInput,
    LabeledTextarea
} from '../components';
import {
    FieldTypes,
    ProfileFields,
    HackerApplicationFields
} from '../constants/forms';

import Autocomplete from 'react-autocomplete';

const FormContainer = styled.div`
    maxWidth: 500px;
    margin: 0 auto;
`;

const Flexer = styled.div`
    display: flex;
    flexDirection: column;
`;

const InputContainer = styled.div`
    margin: 20px 0 30px 0;
`;

const ButtonGroup = styled.div`
    display: flex;
    flexDirection: row;
    justifyContent: space-between;
`;

const SectionHeader = styled.h2`
    fontSize: 40px;
    color: ${props => props.color};
    fontWeight: 500;
    margin: 0;
`;

const FileUploadContainer = styled.div`
    marginTop: 30px;
`;

const SubsectionHeader = styled.h3`
    fontSize: 22px;
    color: ${props => props.color};
    fontWeight: 500;
    margin: 26px 0 0 0;
`;

const AlertContainer = styled.div`
    marginTop: 30px;
`;

const LegalText = styled.p`
    fontSize: 15px;
    color: gray;
`;

const LegalLink = styled.a`
    color: ${props => props.theme.teal};
    textDecoration: none;
`;

const autocompleteMenuStyle = {
    borderRadius: '3px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '2px 0',
    fontSize: '90%',
    position: 'absolute',
    maxHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)/2 +'px',
    left: '20px',
    top: '45px',
    overflow: 'auto',
    zIndex: 10
};

const autocompleteWrapperStyle = {
    display: 'inherit',
    paddingLeft: '20px',
    width: '100%',
    position: 'relative'
};

class Apply extends React.Component {
    constructor(props) {
        super(props);

        const userData = this.props.userState.data.user;

        this.state = {
            birthday: userData.birthday
                ? new Date(userData.birthday).toISOString().split('T')[0]
                : '',
            university: userData.university || '',
            major: userData.major || '',
            tshirt: userData.tshirt || 'm',
            hackathonExperience: userData.hackathonExperience || 'novice',
            resume: null,
            isResumeUploaded: userData.isResumeUploaded || false
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
                    this.state[field.key] = '';
                } else if (field.type === FieldTypes.SELECT) {
                    this.state[field.key] = field.values[0].key;
                } else if (field.type === FieldTypes.INTEGER) {
                    this.state[field.key] = 0;
                }
            }
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleSortItems = this.handleSortItems.bind(this);
        this.handleItemShouldRender = this.handleItemShouldRender.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(ProfileThunks.loadProfile());
    }

    componentWillUpdate(nextProps) {
        if (nextProps.userState.data.isApplicationSubmitted) {
            this.context.router.history.push(routes.PROFILE);
        }
    }

    componentWillReceiveProps(nextProps) {
        const userData = this.props.userState.data.user;
        const nextUserData = nextProps.userState.data.user;

        if (nextProps.userState.fetching) {
            return;
        }

        if (
            userData.birthday !== nextUserData ||
            userData.university !== nextUserData.university ||
            userData.major !== nextUserData.major ||
            userData.isResumeUploaded !== nextUserData.isResumeUploaded
        ) {
            this.setState({
                birthday: nextUserData.birthday
                    ? new Date(nextUserData.birthday)
                          .toISOString()
                          .split('T')[0]
                    : '',
                university: nextUserData.university || '',
                major: nextUserData.major || '',
                isResumeUploaded: userData.isResumeUploaded || false
            });
        }
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
            return queryPosA - queryPosB
        }
        return aLower < bLower ? -1 : 1
    }

    handleItemShouldRender(current, value) {
        return (
            current.toLowerCase().indexOf(value.toLowerCase()) !== -1
        )
    }

    onSubmit(e) {
        e.preventDefault();

        var application = {};
        var files = {};

        const inputBirthday = new Date(this.state.birthday).getTime();

        application.birthday = inputBirthday;
        application.major = this.state.major;
        application.university = this.state.university;
        application.tshirt_size = this.state.tshirt;
        application.experience = this.state.hackathonExperience;

        if (this.state.resume) {
            files['resume'] = this.state.resume;
        }

        this.props.dispatch(
            ApplicationThunks.uploadApplication(application, files)
        );
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

        this.props.dispatch(
            ApplicationThunks.uploadApplication(application, files)
        );
    }

    render() {
        return (
            <PageContainer>
                <FormContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        Application
                    </SectionHeader>
                    <form onSubmit={this.onSubmit}>
                        {this.props.userState.error
                            ? <AlertContainer>
                                  <Alert
                                      message={this.props.userState.message}
                                  />
                              </AlertContainer>
                            : null}
                        <Flexer>
                            <InputContainer>
                                {HackerApplicationFields.map(field => {
                                    if (
                                        (field.key === 'departing_from' ||
                                            field.key ===
                                                'requested_reimbursement') &&
                                        this.state.needs_reimbursement === 'n'
                                    ) {
                                        return;
                                    }

                                    switch (field.type) {
                                        case FieldTypes.TEXT:
                                        case FieldTypes.LINK:
                                            return (
                                                <LabeledInput
                                                    label={field.label}
                                                    labelWidth={
                                                        field.wideLabel
                                                            ? '150px'
                                                            : '100px'
                                                    }
                                                    key={field.key}
                                                >
                                                    {
                                                        field.autocomplete
                                                            ?
                                                            <Autocomplete
                                                                getItemValue={(item) => item}
                                                                items={
                                                                    field.autocomplete
                                                                }
                                                                shouldItemRender={
                                                                    this.handleItemShouldRender
                                                                }
                                                                renderItem={(item, isHighlighted) =>
                                                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                        {item}
                                                                    </div>
                                                                }
                                                                inputProps={{
                                                                    placeholder: field.placeholder,
                                                                    name: field.key,
                                                                    id: field.key
                                                                }}
                                                                sortItems={
                                                                    this.handleSortItems
                                                                }
                                                                value={this.state[
                                                                    field.key
                                                                    ]}
                                                                onChange={
                                                                    this.handleAttributeChange
                                                                }
                                                                onSelect={(e) => {
                                                                    var fakeEvent = {
                                                                        target: {
                                                                            name: field.key,
                                                                            value: e
                                                                        }
                                                                    };

                                                                    this.handleAttributeChange(fakeEvent);
                                                                }}
                                                                menuStyle={
                                                                    autocompleteMenuStyle
                                                                }
                                                                wrapperStyle={
                                                                    autocompleteWrapperStyle
                                                                }
                                                            />
                                                            :
                                                            <input
                                                                id={field.key}
                                                                type="text"
                                                                name={field.key}
                                                                placeholder={
                                                                    field.placeholder
                                                                }
                                                                value={
                                                                    this.state[
                                                                        field.key
                                                                        ]
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleAttributeChange
                                                                }
                                                            />
                                                    }
                                                </LabeledInput>
                                            );
                                        case FieldTypes.ESSAY:
                                            return (
                                                <LabeledTextarea
                                                    label={field.label}
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
                                                        onChange={
                                                            this
                                                                .handleAttributeChange
                                                        }
                                                    />
                                                </LabeledTextarea>
                                            );
                                        case FieldTypes.DATE:
                                            return (
                                                <LabeledInput
                                                    label={field.label}
                                                    labelWidth={
                                                        field.wideLabel
                                                            ? '150px'
                                                            : '100px'
                                                    }
                                                    key={field.key}
                                                >
                                                    <input
                                                        id={field.key}
                                                        type="date"
                                                        name={field.key}
                                                        placeholder={
                                                            field.placeholder
                                                        }
                                                        value={
                                                            this.state[
                                                                field.key
                                                            ]
                                                        }
                                                        onChange={
                                                            this
                                                                .handleAttributeChange
                                                        }
                                                    />
                                                </LabeledInput>
                                            );
                                        case FieldTypes.INTEGER:
                                            return (
                                                <LabeledInput
                                                    label={field.label}
                                                    labelWidth={
                                                        field.wideLabel
                                                            ? '150px'
                                                            : '100px'
                                                    }
                                                    key={field.key}
                                                >
                                                    <input
                                                        id={field.key}
                                                        type="number"
                                                        name={field.key}
                                                        value={
                                                            this.state[
                                                                field.key
                                                            ]
                                                        }
                                                        onChange={
                                                            this
                                                                .handleAttributeChange
                                                        }
                                                    />
                                                </LabeledInput>
                                            );
                                        case FieldTypes.SELECT:
                                            return (
                                                <LabeledInput
                                                    label={field.label}
                                                    labelWidth={
                                                        field.wideLabel
                                                            ? '150px'
                                                            : '100px'
                                                    }
                                                    key={field.key}
                                                >
                                                    <select
                                                        name={field.key}
                                                        value={
                                                            this.state[
                                                                field.key
                                                            ]
                                                        }
                                                        onChange={
                                                            this
                                                                .handleAttributeChange
                                                        }
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
                                                                        {tuple.value}
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>
                                                </LabeledInput>
                                            );
                                        case FieldTypes.SECTIONHEADER:
                                            return (
                                                <SubsectionHeader
                                                    color={
                                                        this.props.theme.primary
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
                                        defaultColor={
                                            this.props.userState.data.user
                                                .isResumeUploaded
                                                ? this.props.theme.success
                                                : this.props.theme.primary
                                        }
                                        hoverColor={this.props.theme.secondary}
                                        activeColor={this.props.theme.success}
                                        onFileSelect={this.handleFileUpload}
                                        defaultText={
                                            this.props.userState.data.user
                                                .isResumeUploaded
                                                ? 'Resume Uploaded'
                                                : null
                                        }
                                    />
                                </FileUploadContainer>
                            </InputContainer>
                            <ButtonGroup>
                                <RoundedButton
                                    type="submit"
                                    color={this.props.theme.primary}
                                >
                                    Submit
                                </RoundedButton>
                            </ButtonGroup>
                            <LegalText>
                                By applying to MHacks Nano, you agree to the
                                MHacks{' '}
                                <LegalLink href="https://docs.google.com/document/d/1L9wC7lfXmOBCKdUQancuoYQf86KIQqUJ0is4dr8QqQM/pub">
                                    Code of Conduct
                                </LegalLink>.
                            </LegalText>
                        </Flexer>
                    </form>
                </FormContainer>
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
