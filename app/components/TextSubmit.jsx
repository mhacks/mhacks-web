import React from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';

const ScaleY0to1 = keyframes`
    from {
        transform: scaleY(0);
    } to {
        transform: scaleY(1);
    }
`;

const TopBottomAnimation = keyframes`
    from {
        transform: scaleX(0);
    } to {
        transform: scaleX(.98);
    }
`;

const ButtonAnimation = keyframes`
    from {
        border-left-width: 0px;
    } to {
        border-left-width: 98px;
    }
`;

const Container = styled.div`
    display: block;
    position: relative;
    whiteSpace: no-wrap;
    minWidth: 350px;
    height: 40px;
`;

const LeftBorder = styled.div`
    position: absolute;
    pointer-events: none;
    z-index: 10;
    width: 15px;
    height: 100%;
    transformOrigin: center left;
    transform: scaleY(0);

    borderRadius: 8px;
    borderLeft: 3px solid ${props => props.focusColor || '#350044'};

    ${props => (props.focused ? `
        animationName: ${ScaleY0to1};
        animationTimingFunction: linear;
        animationFillMode: forwards;
        animationDuration: 0.01s;
    ` : '')}
`;

const TopBottomBorders = styled.div`
    position: absolute;
    pointer-events: none;
    z-index: 10;
    width: 100%;
    height: 100%;

    borderTopLeftRadius: 8px;
    borderBottomLeftRadius: 8px;
    borderTop: 3px solid ${props => props.focusColor || '#350044'};
    borderBottom: 3px solid ${props => props.focusColor || '#350044'};
    transformOrigin: center left;
    transform: scaleX(0);

    ${props => (props.focused ? `
        animationName: ${TopBottomAnimation};
        animationTimingFunction: linear;
        animationFillMode: forwards;
        animationDuration: 0.25s;
        animationDelay: 0.01s;
    ` : '')}
`;

const TopRightBorder = styled.div`
    position: absolute;
    pointer-events: none;
    top: 0;
    right: 3px;
    z-index: 10;
    width: 15px;
    height: 50%;
    transformOrigin: top left;
    transform: scaleY(0);

    borderTopRightRadius: 8px;
    borderRight: 3px solid ${props => props.focusColor || '#350044'};

    ${props => (props.focused ? `
        animationName: ${ScaleY0to1};
        animationTimingFunction: linear;
        animationFillMode: forwards;
        animationDuration: 0.05s;
        animationDelay: 0.3s;
    ` : '')}
`;

const BottomRightBorder = styled.div`
    position: absolute;
    pointer-events: none;
    bottom: 0;
    right: 3px;
    z-index: 10;
    width: 15px;
    height: 50%;
    transformOrigin: bottom left;
    transform: scaleY(0);

    borderBottomRightRadius: 8px;
    borderRight: 3px solid ${props => props.focusColor || '#350044'};

    ${props => (props.focused ? `
        animationName: ${ScaleY0to1};
        animationTimingFunction: linear;
        animationFillMode: forwards;
        animationDuration: 0.05s;
        animationDelay: 0.3s;
    ` : '')}
`;

const Input = styled.input`
    position: relative;
    z-index: 1;
    width: 250px;
    height: 40px;
    border: 3px solid ${props => props.baseColor || '#E6E6E6'};
    borderTopLeftRadius: 8px;
    borderBottomLeftRadius: 8px;
    backgroundColor: white;
    padding: 10px;
    fontSize: 16px;
`;

const Button = styled.button`
    width: 100px;
    height: 40px;
    top: -1px;
    left: -3px;
    position: relative;
    border: 3px solid ${props => props.baseColor || '#E6E6E6'};
    borderRight: 6px solid ${props => props.baseColor || '#E6E6E6'};
    borderTopRightRadius: 8px;
    borderBottomRightRadius: 8px;
    backgroundColor: transparent;
`;

const ButtonBackground = styled.div`
    position: absolute;
    z-index: 2;
    top: 0;
    left: -3px;
    width: 95px;
    height: 100%;
    backgroundColor: ${props => props.baseColor || '#E6E6E6'};
    borderLeft: solid 0px ${props => props.focusColor || '#350044'};

    ${props => (props.focused ? `
        animationName: ${ButtonAnimation};
        animationTimingFunction: linear;
        animationFillMode: forwards;
        animationDuration: 0.1s;
        animationDelay: 0.20s;
    ` : '')}
`;

const ButtonText = styled.span`
    position: relative;
    z-index: 10;

    ${props => (props.focused ? `
        color: white;
        transition: color;
        transitionDelay: .3s;
    ` : 'color: black')}
`;

const Feedback = styled.div`
    width: 350px;
    textAlign: left;
    color: ${props => props.color || props.baseColor || '#E6E6E6'};
`;

export default class TextSubmit extends React.Component {
    constructor() {
        super();
        this.state = { focused: false };
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(e) {
        if (e.key == 'Enter') {
            ReactDOM.findDOMNode(this.refs.textField).blur();
            this.props.onSubmit();
        }
    }

    render() {
        return (
            <div>
                {this.props.feedback
                    ? <Feedback color={this.props.feedbackColor}>
                          {this.props.feedback}
                      </Feedback>
                    : <br />}
                <Container>
                    <LeftBorder
                        focused={this.state.focused}
                        focusColor={this.props.focusColor}
                        baseColor={this.props.baseColor}
                    />
                    <TopBottomBorders
                        focused={this.state.focused}
                        focusColor={this.props.focusColor}
                        baseColor={this.props.baseColor}
                    />
                    <TopRightBorder
                        focused={this.state.focused}
                        focusColor={this.props.focusColor}
                        baseColor={this.props.baseColor}
                    />
                    <BottomRightBorder
                        focused={this.state.focused}
                        focusColor={this.props.focusColor}
                        baseColor={this.props.baseColor}
                    />
                    <Input
                        type="text"
                        ref="textField"
                        value={this.props.value}
                        onChange={this.props.onChange}
                        placeholder={this.props.placeholder}
                        onFocus={() => {
                            this.setState({ focused: true });
                        }}
                        onBlur={() => {
                            this.setState({ focused: false });
                        }}
                        onKeyDown={e => {
                            this.handleKeyPress(e);
                        }}
                        baseColor={this.props.baseColor}
                    />
                    <Button
                        onClick={this.props.onSubmit}
                        baseColor={this.props.baseColor}
                    >
                        <ButtonBackground
                            focused={this.state.focused}
                            focusColor={this.props.focusColor}
                            baseColor={this.props.baseColor}
                        />
                        <ButtonText
                            focused={this.state.focused}
                            focusColor={this.props.focusColor}
                            baseColor={this.props.baseColor}
                        >
                            {this.props.buttonText}
                        </ButtonText>
                    </Button>
                </Container>
            </div>
        );
    }
}
