import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const Wrapper = styled.div`
    display: inline-block;
`;

const Header = styled.h3`
    display: inline-block;
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    margin-top: 0;
    margin-bottom: 0;
    max-width: 80%;
    color: ${props => props.primary};
    font-size: 18px;
`;

const Body = styled.p`
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
    position: relative;
    width: 100%;
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

const Chevron = props => {
    return (
        <i
            className="fas fa-chevron-right"
            style={{
                display: 'inline-block',
                position: 'absolute',
                right: 0,
                float: 'right',
                color: props.color,
                transition: 'all 0.3s linear',
                transform: props.open ? 'rotate(90deg)' : 'rotate(0deg)',
                paddingTop: '3px'
            }}
        />
    );
};

export default class ExpandingItem extends React.Component {
    constructor(props) {
        super();
        this.state = { expanded: false, currentColor: props.colorOff };
        this.handleClick = this.handleClick.bind(this);
        this.handleChevronColor = this.handleChevronColor.bind(this);
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

    handleChevronColor() {
        return this.props.expandColor
            ? this.state.currentColor
            : this.props.chevronColor;
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
                        <Chevron
                            color={this.handleChevronColor()}
                            open={this.state.expanded}
                        />
                        {this.props.header}
                    </Header>
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
