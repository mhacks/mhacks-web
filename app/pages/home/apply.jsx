import React from 'react';
import { connect } from 'react-redux';
import { RoundedButton } from '../../components';
import { SectionHeader, SectionBody } from './section_components.jsx';

class Apply extends React.Component {
    render() {
        return (
            <div>
                <SectionHeader>Apply</SectionHeader>
                <SectionBody>Apply to MHacks Nano! We will just ask you a couple questions about yourself, your hackathon experiences and allow you to form a team.</SectionBody>
                <a href="/login">
                    <RoundedButton
                        type="button"
                        color={this.props.theme.primary}
                    >
                    Log In
                    </RoundedButton>
                </a>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Apply);
