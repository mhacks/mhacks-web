import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import {
    PageContainer,
    MHForm
} from '../components';
import {
   ConfirmAttendanceSchema
} from '../constants/forms';

const FormContainer = styled.div`
    maxWidth: 500px;
    margin: 0 auto;
    minHeight: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 0 50px;
`;

class Confirm extends React.Component {

    onSubmit(formData) {
        console.log(formData);
    }

    render() {
        return (
            <PageContainer>
                <FormContainer>
                    <h2>Will you be attending MHacks X?</h2>
                    <MHForm
                        schema={ConfirmAttendanceSchema}
                        theme={this.props.theme}
                        onSubmit={this.onSubmit}
                    />
                    <p>By confirming attendance, you also confirm you have read and agree to the <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">MLH Code of Conduct</a>, the <a href="https://github.com/MLH/mlh-policies/blob/master/data-sharing.md">MLH Data Sharing Provision</a>, the <a href="https://docs.google.com/document/d/1L9wC7lfXmOBCKdUQancuoYQf86KIQqUJ0is4dr8QqQM/pub">MHacks Code of Conduct</a>, and the <a href="https://docs.google.com/document/d/1tFmaC_eVVPJ9fKnjGeYHRX2_th3-JOd9ZP-IoTEM91I/pub">MHacks Liability Waiver</a>.</p>
                </FormContainer>
            </PageContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Confirm);
