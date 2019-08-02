import React from 'react';
import { AuthThunks } from '../actions';
import { routes } from '../constants';
import { connect } from 'react-redux';
import { replace } from 'connected-react-router';

class Logout extends React.Component {
    componentDidMount() {
        this.props.dispatch(AuthThunks.logout());
        window.localStorage.clear();
        this.props.dispatch(replace(routes.HOME));
    }

    render() {
        return <div />;
    }
}

export default connect()(Logout);
