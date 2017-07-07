import React from 'react';
import { AuthThunks } from '../actions';
import { routes } from '../constants';
import { connect } from 'react-redux';

class Logout extends React.Component {
    componentWillMount() {
        this.props.dispatch(AuthThunks.logout());
        window.localStorage.clear();
        this.context.router.history.replace(routes.HOME);
    }

    render() {
        return <div />;
    }
}

Logout.contextTypes = {
    router: React.PropTypes.object
};

export default connect()(Logout);
