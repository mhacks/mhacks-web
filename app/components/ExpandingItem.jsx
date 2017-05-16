import React from 'react';
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`
    display: inline-block
`;

const Header = styled.h3`
    display: inline-block;
    -webkit-margin-before: 10px;
    -webkit-margin-after: 10px;
    color: ${props => props.color};
    fontSize: 18px;
    flex: 1;
`;

const Body = styled.p`
    paddingLeft: 35px;
    -webkit-margin-before: 0px;
    color: ${props => props.color};
    fontSize: 15px;
`;

const Flexbox = styled.div`
    display: flex;
    cursor: pointer;
`;

const Open = keyframes`
    from {
        transform: scaleY(0);
    } to {
        height: max-content;
        transform: scaleY(1);
    }
`;

const Close = keyframes`
    from {
        height: max-content;
        transform: scaleY(1);
    } to {
        height: 0px;
        transform: scaleY(0);
    }
`;

const Slider = styled.div`
    overflow: hidden;
    transformOrigin: top center;
    
    ${props => (props.open ? ` 
        animation: ${Open} 0.3s ease-in-out;
        animationFillMode: forwards;
    ` : `
        height: max-content;
        animation: ${Close} 0.3s ease-in-out;
        animationFillMode: forwards;
    `)}
`;

const PlusWrapper = styled.div`
    position: relative;
    display: inline-block;
    margin: 10px;
    height: 15px;
    width: 15px;
`;

const PlusLine = styled.div`
    display: inline-block;
    position: absolute;
    backgroundColor: ${props => props.color};
    height: 10px;
    width: 2px;
    top: 3px;
    transitionDuration: 0.3s;

    ${props => (!props.vertical ? `
        transform: rotate(90deg);
    ` : `
        transform: rotate(0deg);
    `)}
`;

const Plus = props => {
    return (
        <PlusWrapper>
            <PlusLine color={props.color} />
            <PlusLine color={props.color} vertical={!props.open} />
        </PlusWrapper>
    );
};

export default class ExpandingItem extends React.Component {
    constructor() {
        super();
        this.state = { expanded: false };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }));
    }

    render() {
        return (
            <Wrapper>
                <Flexbox onClick={this.handleClick}>
                    <Plus
                        color={this.props.plusColor}
                        open={this.state.expanded}
                    />
                    <Header color={this.props.headerColor}>
                        {this.props.header}
                    </Header>
                </Flexbox>
                <Slider open={this.state.expanded}>
                    <Body color={this.props.bodyColor}>{this.props.body}</Body>
                </Slider>
            </Wrapper>
        );
    }
}
