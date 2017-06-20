import React from 'react';
import { connect } from 'react-redux';

class Chat extends React.Component {
    render(){
        console.log(this.props.token)
        return (
            <div>chat here</div>
        );
    }
}

function mapStateToProps(state){
    return {
        token: state.userState.data.token
    }
}

export default connect(mapStateToProps)(Chat);