import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const Input = styled.input`
    height: 40px;
    width: 100%;
    border: 2px solid lightgray;
    borderRadius: 8px;
    padding: 10px;
    marginTop: 20px;
`;

class InputBar extends React.Component {
    constructor() {
        super();
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            text: ''
        };
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.onSubmit(this.state.text);
            this.setState({ text: '' });
        }
    }

    handleChange(e) {
        this.setState({
            text: e.target.value
        });
    }

    render() {
        return (
            <Input
                type="text"
                ref="textField"
                value={this.state.text}
                onChange={e => {
                    this.handleChange(e);
                }}
                onKeyDown={e => {
                    this.handleKeyPress(e);
                }}
                borderColor={this.props.theme.primary}
                placeholder="Type here and press enter to send a message..."
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(InputBar);
