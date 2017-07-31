import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ConfirmationThunks } from '../actions';
import { PageContainer, MHForm, Alert } from '../components';
import { ConfirmAttendanceSchema } from '../constants/forms';

const FormContainer = styled.div`
    maxWidth: 500px;
    margin: 0 auto;
    minHeight: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 20px 50px 20px;
`;

class Confirm extends React.Component {
    constructor() {
        super();

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(ConfirmationThunks.loadConfirmation());
    }

    onSubmit(formData) {
        this.props.dispatch(ConfirmationThunks.uploadConfirmation(formData));
    }

    render() {
        return (
            <PageContainer>
                <FormContainer>
                    {this.props.userState.data.user.isConfirmed
                        ? <Alert message="You are confirmed!" positive={true} />
                        : null}
                    <h2>Confirm Attendance at MHacks X!</h2>
                    <MHForm
                        schema={ConfirmAttendanceSchema}
                        theme={this.props.theme}
                        onSubmit={this.onSubmit}
                    />
                    <p>
                        By confirming attendance, you also confirm you have read
                        and agree to the{' '}
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
            </PageContainer>
        );
    }
}

Confirm.contextTypes = {
    router: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Confirm);
