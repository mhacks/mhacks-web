import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ApplicationThunks } from '../actions';
import { PageContainer, Alert } from '../components';
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

        this.state = {
            notifications: OrderedSet()
        };

        this.onSubmit = this.onSubmit.bind(this);
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

    static getDerivedStateFromProps(nextProps) {
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

        return {
            userState: nextProps.userState
        };
    }

    onSubmit(formData, files) {
        this.props.dispatch(
            ApplicationThunks.uploadApplication(formData, files)
        );

        this.addNotification('Application Saved!', 'save');
    }

    render() {
        if (
            !this.state.userState ||
            !this.state.userState.data ||
            (!this.state.userState.data.form &&
                !this.state.userState.data.app &&
                !this.state.userState.data.user)
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
                                    message={`Your application is submitted but you can make changes on this page and update your application! Thanks for applying to ${
                                        this.props.configurationState.data
                                            .app_name
                                    }.`}
                                    positive={true}
                                />
                            </AlertContainer>
                        ) : null}
                        <Subhead>
                            Apply for{' '}
                            {this.props.configurationState.data.app_name}!{' '}
                            {this.props.configurationState.data.app_name} will
                            be held on the University of Michigan's North Campus
                            in Ann Arbor from September 22nd to 24th. If you
                            already have teammates in mind, include their names
                            and emails in the "anything else" question.
                        </Subhead>

                        <LegalText>
                            By applying to{' '}
                            {this.props.configurationState.data.app_name}, you
                            agree to the MHacks{' '}
                            <LegalLink href="https://docs.google.com/document/d/1L9wC7lfXmOBCKdUQancuoYQf86KIQqUJ0is4dr8QqQM/pub">
                                Code of Conduct
                            </LegalLink>.
                        </LegalText>
                        <MHForm
                            schema={this.state.userState.data.form}
                            FieldTypes={this.state.userState.data.FieldTypes}
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
        theme: state.theme.data,
        configurationState: state.configurationState
    };
}

export default connect(mapStateToProps)(Apply);
