import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ApplicationThunks } from '../actions';
import { PageContainer, Alert } from '../components';
import {
    FieldTypes,
    ProfileFields,
    HackerApplicationFields
} from '../constants/forms';
import PropTypes from 'prop-types';

import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';
import { MHForm } from '../components';

const FormContainer = styled.div`
    max-width: 500px;
    margin: 0 auto;
    min-height: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 20px 50px 20px;
`;

const SectionHeader = styled.h2`
    font-size: 40px;
    color: ${props => props.color};
    font-weight: 500;
    margin: 0;
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
        this.props.dispatch(ApplicationThunks.loadForm());
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.userState.data.form &&
            nextProps.userState.data.app &&
            nextProps.userState.data.user
        ) {
            var temp = Object.assign(
                {},
                nextProps.userState.data.app,
                nextProps.userState.data.user
            );
            for (var i in temp) {
                if (i in nextProps.userState.data.form) {
                    nextProps.userState.data.form[i].default = temp[i];
                }
            }
        }

        this.setState({
            userState: nextProps.userState
        });
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
        if (
            !this.state.userState ||
            !this.state.userState.data ||
            (!this.state.userState.data.form && !this.state.userState.data.app)
        ) {
            return null;
        }

        return (
            <PageContainer>
                <FormContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        Application
                    </SectionHeader>
                    <div>
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

                        <LegalText>
                            By applying to MHacks X, you agree to the MHacks{' '}
                            <LegalLink href="https://docs.google.com/document/d/1L9wC7lfXmOBCKdUQancuoYQf86KIQqUJ0is4dr8QqQM/pub">
                                Code of Conduct
                            </LegalLink>.
                        </LegalText>
                        <MHForm
                            schema={this.state.userState.data.form}
                            FieldTypes={this.state.userState.data.FieldTypes}
                            hidden={{ reader: true, status: true }}
                            theme={this.props.theme}
                            onSubmit={this.onSubmit}
                        />
                    </div>
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
    router: PropTypes.object
};

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Apply);
