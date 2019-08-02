import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ConfirmationThunks } from '../actions';
import { PageContainer, MHForm, Alert } from '../components';
import { getUserMetadata } from '../util/user.js';
import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';
import PropTypes from 'prop-types';

const FormContainer = styled.div`
    max-width: 500px;
    margin: 0 auto;
    min-height: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 20px 50px 20px;
`;

class Confirm extends React.Component {
    constructor() {
        super();

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
        this.props.dispatch(ConfirmationThunks.loadConfirmation());
        this.props.dispatch(ConfirmationThunks.loadForm());
    }

    static getDerivedStateFromProps(nextProps) {
        if (
            nextProps.userState.data.form &&
            nextProps.userState.data.confirmation
        ) {
            for (var i in nextProps.userState.data.confirmation) {
                if (i in nextProps.userState.data.form) {
                    nextProps.userState.data.form[i].default =
                        nextProps.userState.data.confirmation[i];
                }
            }
        }

        return {
            userState: nextProps.userState
        };
    }

    onSubmit(formData) {
        this.props.dispatch(ConfirmationThunks.uploadConfirmation(formData));

        this.addNotification('Confirmation Saved!', 'save');
    }

    render() {
        if (
            !this.state.userState ||
            !this.state.userState.data ||
            (!this.state.userState.data.form &&
                !this.state.userState.data.confirmation)
        ) {
            return null;
        }

        const { isConfirmed } = getUserMetadata(this.state.userState.data);

        const configurationData = this.props.configurationState.data;

        return (
            <PageContainer>
                <FormContainer>
                    {isConfirmed ? (
                        <Alert message="You are confirmed!" positive={true} />
                    ) : null}
                    <h2>Confirm Attendance at {configurationData.app_name}!</h2>
                    <MHForm
                        schema={this.state.userState.data.form}
                        FieldTypes={this.state.userState.data.FieldTypes}
                        theme={this.props.theme}
                        onSubmit={this.onSubmit}
                    />
                    <p>
                        By confirming attendance, you confirm you have read and
                        agree to the{' '}
                        <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">
                            MLH Code of Conduct
                        </a>
                        , the{' '}
                        <a href="https://mlh.io/privacy">MLH Privacy Policy</a>,
                        the{' '}
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

Confirm.contextTypes = {
    router: PropTypes.object
};

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data,
        configurationState: state.configurationState
    };
}

export default connect(mapStateToProps)(Confirm);
