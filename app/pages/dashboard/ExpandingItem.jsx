import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const Wrapper = styled.div`
    display: inline-block;
    width: 100%;
`;

const Header = styled.h3`
    display: inline-block;
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    margin-top: 0;
    margin-bottom: 0;
    color: ${props => props.primary};
    font-size: 25px;
`;

const Body = styled.span`
    padding-left: 25px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    -webkit-margin-before: 5px;
    -webkit-margin-after: 5px;
    color: ${props => props.primary};
    font-size: 15px;
`;

const Flexbox = styled.div`
    display: flex;
    cursor: pointer;
    justify-content: space-between;
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

const sliderOpen = css`
    animation: ${Open} 0.3s ease-in-out;
    animation-fill-mode: forwards;
`;

const sliderClosed = css`
    height: max-content;
    animation: ${Close} 0.3s ease-in-out;
    animation-fill-mode: forwards;
`;

const Slider = styled.div`
    overflow: hidden;
    transform-origin: top center;

    ${props => (props.open ? sliderOpen : sliderClosed)};
`;

const PlusWrapper = styled.div`
    position: relative;
    display: inline-block;
    margin: 0;
    margin-left: 10px;
    height: 15px;
    width: 15px;
    z-index: 10;
`;

const PlusLine = styled.div`
    display: inline-block;
    position: absolute;
    z-index: -1;
    background-color: ${props => props.primary};
    height: 15px;
    width: 2px;
    top: 10px;
    transition-duration: 0.3s;

    ${props =>
        !props.vertical
            ? `
        transform: rotate(90deg);
    `
            : `
        transform: rotate(0deg);
    `};
`;

const Plus = props => {
    return (
        <PlusWrapper>
            <PlusLine primary={props.primary} />
            <PlusLine primary={props.primary} vertical={!props.open} />
        </PlusWrapper>
    );
};

export default class ExpandingItem extends React.Component {
    constructor(props) {
        super();
        this.state = { expanded: false, currentColor: props.colorOff };
        this.handleClick = this.handleClick.bind(this);
        this.handlePlusColor = this.handlePlusColor.bind(this);
        this.handleHeaderColor = this.handleHeaderColor.bind(this);
        this.handleBodyColor = this.handleBodyColor.bind(this);
    }

    handleClick() {
        if (this.props.expandColor) {
            this.setState(prevState => ({
                expanded: !prevState.expanded,
                currentColor: this.state.expanded
                    ? this.props.colorOff
                    : this.props.colorOn
            }));
        } else {
            this.setState(prevState => ({
                expanded: !prevState.expanded
            }));
        }
    }

    handlePlusColor() {
        return this.props.expandColor
            ? this.state.currentColor
            : this.props.plusColor;
    }

    handleHeaderColor() {
        return this.props.expandColor
            ? this.state.currentColor
            : this.props.headerColor;
    }

    handleBodyColor() {
        return this.props.expandColor
            ? this.state.currentColor
            : this.props.bodyColor;
    }

    render() {
        return (
            <Wrapper>
                <Flexbox onClick={this.handleClick}>
                    <Header primary={this.handleHeaderColor()}>
                        {this.props.header}
                    </Header>
                    <Plus
                        primary={this.handlePlusColor()}
                        open={this.state.expanded}
                    />
                </Flexbox>
                <Slider open={this.state.expanded}>
                    <Body primary={this.handleBodyColor()}>
                        {this.props.body}
                    </Body>
                </Slider>
            </Wrapper>
        );
    }
}
