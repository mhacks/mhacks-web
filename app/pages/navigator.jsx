import React from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { withRouter } from 'react-router-dom';
import Header from './header.jsx';
import Footer from './footer.jsx';

class Navigator extends React.Component {
    render() {
        return (
            <ThemeProvider theme={this.props.theme}>
                <div>
                    <Header />
                    {React.Children.toArray(this.props.children)}
                    <Footer />
                </div>
            </ThemeProvider>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default withRouter(connect(mapStateToProps)(Navigator));
