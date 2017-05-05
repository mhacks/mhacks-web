import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import styled from 'styled-components';

import { routes } from '../../constants';
import { devices } from '../../styles';
import { SubscribeThunks } from '../../actions';
import { InputText } from '../../components';
import Header from './header.jsx';

/* Containers */
const Page = styled.div`
    backgroundColor: black;
    width: 100%;
    height: 100%;
    color: #F1F7FF;
`;

const FlexBox = styled.div`
    display: flex;

    ${devices.tablet`
        height: 90%;
    `}
`;

const VerticalCenter = styled.div`
    alignSelf: center;
    margin: auto;
    display: block;
    position: relative;
    paddingBottom: 30px;
    textAlign: center;
`;

/* Styled elements */
const Subhead = styled.h3`
    marginBottom: 30px;
    fontSize: 20px;
`;

const Anchor = styled.a`
    marginLeft: 10px;
    color: #BFBFBF;
`;

/* Footer Section */
const Footer = styled.div`
    display: flex;
    flexWrap: wrap;
    justifyContent: space-between;
    alignItems: flex-end;
    height: 10%;
`;

const Left = styled.div`
    ${devices.tablet`
        marginLeft: 10px;
        marginRight: 10px;
    `}
`;

const Right = styled.div`
    ${devices.tablet`
        marginLeft: 10px;
        marginRight: 10px;
    `}
`;

/* Page Component */
class BlackoutPage extends React.Component {
    constructor() {
        super();

        this.state = {
            email: '',
            feedback: ''
        };

        this.emailChange = this.emailChange.bind(this);
        this.submitEmail = this.submitEmail.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(push(routes.SUBSCRIBE));
    }

    emailChange(e) {
        this.setState({
            email: e.target.value
        });
    }

    submitEmail() {
        this.props.dispatch(SubscribeThunks.subscribe(this.state.email));
        this.setState({ email: '' });
    }

    render() {
        return (
            <Page>
                <Header />
                <FlexBox>
                    <VerticalCenter>
                        <Subhead>Subscribe for Updates</Subhead>
                        <InputText
                            color={this.props.theme.darkPink}
                            borderColor="white"
                            placeholder="ENTER YOUR EMAIL FOR UPDATES"
                            placeholderColor={this.props.theme.darkPink}
                            feedbackColor="white"
                            width="300px"
                            feedback={this.props.status.message}
                            value={this.state.email}
                            onChange={e => {
                                this.emailChange(e);
                            }}
                            onSubmit={this.submitEmail}
                        />
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

function mapStateToProps(state) {
    return {
        status: state.subscribeState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(BlackoutPage);
