import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ApplicationThunks } from '../actions';
import { PageContainer, Alert, MHForm } from '../components';
import PropTypes from 'prop-types';

import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';

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
    color: ${props => props.theme.primary};
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
                }
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

        this.addNotification('Registration Saved!', 'save');
    }

    render() {
        if (
            !this.state.userState ||
            !this.state.userState.fetched ||
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
                        Register
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
                                    message={`Your registration is submitted but you can make changes on this page and update your information! Thanks for registering for ${this.props.configurationState.data.app_name}.`}
                                    positive={true}
                                />
                            </AlertContainer>
                        ) : null}
                        <Subhead>
                            Register for{' '}
                            {this.props.configurationState.data.app_name}!{' '}
                            {this.props.configurationState.data.app_name} will
                            be held on the University of Michigan's Intramural
                            Sports Building in Ann Arbor from{' '}
                            {new Date(
                                this.props.configurationState.data.start_date
                            ).toLocaleString('default', {
                                month: 'long',
                                day: 'numeric',
                                timeZone: 'America/Detroit'
                            })}
                            th to{' '}
                            {new Date(
                                this.props.configurationState.data.end_date
                            ).toLocaleString('default', {
                                day: 'numeric',
                                timeZone: 'America/Detroit'
                            })}
                            th. If you already have teammates in mind, include
                            their names and emails in the "anything else"
                            question.
                        </Subhead>
                        <Subhead>
                            After applying, head over to the{' '}
                            <LegalLink href="/game">SiMHacks</LegalLink> page to
                            fill out a quick questionnaire for a minigame within{' '}
                            {this.props.configurationState.data.app_name}!
                        </Subhead>
                        <LegalText>
                            By registering for{' '}
                            {this.props.configurationState.data.app_name}, you
                            agree to the MHacks{' '}
                            <LegalLink href="https://docs.google.com/document/d/1L9wC7lfXmOBCKdUQancuoYQf86KIQqUJ0is4dr8QqQM/pub">
                                Code of Conduct
                            </LegalLink>
                            .
                        </LegalText>
                        <LegalText>
                            All minors must submit the{' '}
                            <LegalLink href="https://mha.cx/minorforms">
                                University of Michigan Children on Campus
                            </LegalLink>{' '}
                            form prior to confirming their attendance to{' '}
                            {this.props.configurationState.data.app_name}.
                        </LegalText>
                        <MHForm
                            schema={this.state.userState.data.form}
                            FieldTypes={this.state.userState.data.FieldTypes}
                            theme={this.props.theme}
                            onSubmit={this.onSubmit}
                        />
                        <p>
                            By applying, you confirm you have read and agree to
                            the{' '}
                            <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">
                                MLH Code of Conduct
                            </a>
                            , the{' '}
                            <a href="https://mlh.io/privacy">
                                MLH Privacy Policy
                            </a>
                            , the{' '}
                            <a href="https://github.com/MLH/mlh-policies/blob/master/prize-terms-and-conditions/contest-terms.md">
                                MLH Contest Terms and Conditions
                            </a>
                            , the{' '}
                            <a href="https://docs.google.com/document/d/1L9wC7lfXmOBCKdUQancuoYQf86KIQqUJ0is4dr8QqQM/pub">
                                MHacks Code of Conduct
                            </a>
                            , and the{' '}
                            <a href="https://docs.google.com/document/d/1tFmaC_eVVPJ9fKnjGeYHRX2_th3-JOd9ZP-IoTEM91I/pub">
                                MHacks Liability Waiver
                            </a>
                            .
                        </p>
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
                    activeBarStyleFactory={(index, style) => {
                        return Object.assign(
                            {},
                            style,
                            { bottom: `${2 + index * 4}rem` },
                            { zIndex: 10000 }
                        );
                    }}
                    dismissAfter={5000}
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
