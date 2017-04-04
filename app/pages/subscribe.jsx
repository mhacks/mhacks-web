import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import styled from 'styled-components'

import { routes } from '../constants'

const Container = styled.div`
    
`

class SubscribePage extends React.Component {

    componentWillMount(){
        this.props.dispatch(push(routes.SUBSCRIBE));
    }

    render () {
        return (
            <Container>Subscribe</Container>
        );
    }
}

function mapStateToProps(/*state*/){
    return {
    }
}

export default connect(mapStateToProps)(SubscribePage)
