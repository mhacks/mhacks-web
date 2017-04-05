import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import styled from 'styled-components'

import { routes } from '../constants'
import { devices } from '../styles'
import { SubscribeThunks } from '../actions'

var Background = require('../../static/backgrounds/night.jpg')

const Page = styled.div`
    backgroundColor: #2D2E2F;
    width: 100%;
    height: 100%;
    color: #F1F7FF;
    padding: 15px;
    backgroundImage: url('${Background}');
    backgroundSize:cover; 
    backgroundAttachment:fixed;
    zIndex: 0;
`

const FlexBox = styled.div`
    display: flex;

    ${devices.tablet`
        height: 90%;
    `}
`

const VerticalCenter = styled.div`  
    alignSelf: center;
    margin: auto;
    display: block;
    position: relative;
    paddingBottom: 30px;
    textAlign: center;
`

const Header = styled.h1`
    fontSize: 70px;
`

const Subhead = styled.h3`
    marginBottom: 30px;
    fontSize: 20px;
`

const Underline = styled.div`
    color: #BFBFBF;
    position: relative;
    margin: auto;
    marginBottom: 50px;
    width: 350px;
`

const LineLeft = styled.hr`
    width: 100px;
    position: absolute;
    top: 3px;

`

const LineRight = styled.hr`
    width: 100px;
    position: absolute;
    top: 3px;
    right: 0px;
`

const Input = styled.input`
    width: 250px;
    height: 40px;
    border: 3px solid #E6E6E6;
    borderTopLeftRadius: 8px;
    borderBottomLeftRadius: 8px;
    padding: 10px;
    fontSize: 16px;
` 

const Button = styled.button`
    width: 100px;
    height: 40px;
    top: -1px;
    left: -3px;
    position: relative;
    border: 3px solid #E6E6E6;
    borderTopRightRadius: 8px;
    borderBottomRightRadius: 8px;
    backgroundColor: #E6E6E6;
`

const TextSubmit = styled.div`
    display: block;
    position: relative;
    whiteSpace: no-wrap;
    minWidth: 350px;
`

const Footer = styled.div`
    display: flex;
    flexWrap: wrap;
    justifyContent: space-between;
    alignItems: flex-end;
    height: 10%;
`

const Left = styled.div`
    ${devices.tablet`
        marginLeft: 10px;
        marginRight: 10px;
    `}
`

const Right = styled.div`
    ${devices.tablet`
        marginLeft: 10px;
        marginRight: 10px;
    `}
    
`

const Anchor = styled.a`
    marginLeft: 10px;
    color: #BFBFBF;
`

class SubscribePage extends React.Component {

    constructor(){
        super();
        
        this.state = { 
            email: ''
        }

        this.emailChange = this.emailChange.bind(this)
        this.submitEmail = this.submitEmail.bind(this)
    }

    componentDidMount(){
        this.props.dispatch(push(routes.SUBSCRIBE))
    }

    emailChange(e) {
        this.setState({
            email: e.target.value
        })
    }

    submitEmail() {
        this.props.dispatch(SubscribeThunks.subscribe(this.state.email))
    }

    render () {
        return (
            <Page>
                <FlexBox>
                    <VerticalCenter>
                        <Header>MHacks10</Header>
                        <Underline>Coming in Fall 2017
                            <LineRight/><LineLeft/>
                        </Underline>
                        <Subhead>Subscribe for Updates</Subhead>
                        <TextSubmit>
                            <Input 
                                type="text" 
                                value={this.state.email}
                                onChange={e => {this.emailChange(e)}}
                                placeholder="example@email.com"/>
                            <Button 
                                onClick={this.submitEmail}>
                                Subscribe
                            </Button>
                        </TextSubmit>
                    </VerticalCenter>
                </FlexBox>
                <Footer>
                    <Left>
                        Have any questions?
                        <Anchor href="mailto:hackathon@umich.edu">
                            hackathon@umich.edu
                        </Anchor>
                    </Left>
                    <Right>
                        Sponsorship inquiries: 
                        <Anchor href="mailto:sponsor-mhacks@umich.edu">
                            sponsor-mhacks@umich.edu
                        </Anchor>
                    </Right>
                </Footer>
            </Page>
        );
    }
}

function mapStateToProps(state){
    return {
        status: state.subscribeState
    }
}

export default connect(mapStateToProps)(SubscribePage)
