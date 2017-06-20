import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

const Input = styled.input`
    width: 100%;
    height: 35px;
    border: 2px solid ${props => props.borderColor};
    borderRadius: 0 0 8px 8px;
    padding: 10px;
    position: absolute;
    bottom: 0;
`

class InputBar extends React.Component {
    
    constructor() {
        super();
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            text: ''
        }
    }

    handleKeyPress(e) {
        if (e.key == 'Enter') {
            ReactDOM.findDOMNode(this.refs.textField).blur();
            this.props.onSubmit(this.state.text);
            this.setState({text: ''});
        }
    }

    handleChange(e) {
        this.setState({
            text: e.target.value
        })
    }

    render() {
        return (
            <div>
                <Input 
                    type="text"
                    ref="textField"
                    value={this.state.text}
                    onChange={e => {this.handleChange(e)}}
                    onKeyDown={e => {this.handleKeyPress(e)}}
                    borderColor={this.props.theme.primary}
                />
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        theme: state.theme.data
    }
}

export default connect (mapStateToProps)(InputBar);