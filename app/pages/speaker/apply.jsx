import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SpeakerThunks } from '../../actions';
import { PageContainer, MHForm } from '../../components';
import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';

const FormContainer = styled.div`
    max-width: 500px;
    margin: 0 auto;
    min-height: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 20px 50px 20px;
`;

class Apply extends React.Component {
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
        this.props.dispatch(SpeakerThunks.loadApplication());
        this.props.dispatch(SpeakerThunks.loadForm());
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.userState.data.form &&
            nextProps.userState.data.speaker_application
        ) {
            for (var i in nextProps.userState.data.speaker_application) {
                if (i in nextProps.userState.data.form) {
                    nextProps.userState.data.form[i].default =
                        nextProps.userState.data.speaker_application[i];
                }
            }
        }

        this.setState({
            userState: nextProps.userState
        });
    }

    onSubmit(formData, files) {
        this.props.dispatch(SpeakerThunks.uploadApplication(formData, files));

        this.addNotification('Application Saved!', 'save');
    }

    render() {
        if (
            !this.state.userState ||
            !this.state.userState.data ||
            (!this.state.userState.data.form &&
                !this.state.userState.data.speaker_application)
        ) {
            return null;
        }

        return (
            <PageContainer>
                <FormContainer>
                    <h2>Speaker Application</h2>
                    <p>
                        Apply to be a speaker at MHacks X! Know something cool
                        that others might be interested in learning about? Host
                        a tech talk or workshop and teach your fellow hackers a
                        thing or two!
                    </p>
                    <MHForm
                        schema={this.state.userState.data.form}
                        FieldTypes={this.state.userState.data.FieldTypes}
                        theme={this.props.theme}
                        onSubmit={this.onSubmit}
                    />
                    <p>
                        By applying to be a Speaker, you also confirm you have
                        read and agree to the{' '}
                        <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">
                            MLH Code of Conduct
                        </a>, the{' '}
                        <a href="https://github.com/MLH/mlh-policies/blob/master/data-sharing.md">
                            MLH Data Sharing Provision
                        </a>, the{' '}
                        <a href="https://docs.google.com/document/d/1L9wC7lfXmOBCKdUQancuoYQf86KIQqUJ0is4dr8QqQM/pub">
                            MHacks Code of Conduct
                        </a>, and the{' '}
                        <a href="https://docs.google.com/document/d/1tFmaC_eVVPJ9fKnjGeYHRX2_th3-JOd9ZP-IoTEM91I/pub">
                            MHacks Liability Waiver
                        </a>.
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
