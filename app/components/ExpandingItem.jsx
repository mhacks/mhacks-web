import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    
`;

const Plus = styled.span`
    paddingRight: 10px;
    color: ${props => props.color};
`;

const Header = styled.h3`
    display: inline-block;
    -webkit-margin-after: 10px;
    color: ${props => props.color};
    fontSize: 18px;
`;

const Body = styled.p`
    paddingLeft: 20px;
    -webkit-margin-before: 0px;
    color: ${props => props.color};
    fontSize: 15px;
`;

export default class ExpandingItem extends React.Component {

    constructor(){
        super();
        this.state = { expanded: false };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){

    }

    render() {
        return (
            <Wrapper>
                <div onClick={this.handleClick}>
                    <Plus color={this.props.plusColor}>+</Plus>
                    <Header color={this.props.headerColor}>{this.props.header}</Header>
                </div>
                <Body color={this.props.bodyColor}>{this.props.body}</Body>
            </Wrapper>
        );
    }

}
