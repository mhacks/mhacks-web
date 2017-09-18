import React from 'react';
import styled from 'styled-components';
import theme from '../styles/theme.js';

// Added to not take up space in document flow but still allow
// floating squares to be affected by overflow: hidden in containers
const RelativeContainer = styled.div`
    position: relative;
    width: 0;
    height: 0;
`;

const Wrapper = styled.div`
    position: absolute;
    top: 80px;
    left: 0;

    height: ${props => props.height}px;
    width: ${props => props.width}px;
    overflow-x: hidden;
    overflow-y: hidden;
    background: rgba(0, 0, 0, 0);
    zIndex: 5;
    pointer-events: none;
`;

const Square = styled.svg`
    position: absolute;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    fill: rgba(0, 0, 0, 0);
    stroke: ${theme.highlight};
    stroke-width: 8;
    fill-opacity: 0;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-opacity: ${props => props.sOpacity};
`;

class Animations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageHeight: 0,
            pageWidth: 0
        };
        this.randomSquares = this.randomSquares.bind(this);
    }

    componentDidMount() {
        this.setState({
            pageWidth: document.body.scrollWidth,
            pageHeight: document.body.scrollHeight
        });
    }

    randomSquares() {
        var squaresPer1000 = 12;
        var squaresList = [];
        var height = this.state.pageHeight;
        for (var i = 0; i < Math.ceil(height / 1000) * squaresPer1000; i++) {
            var id = 'square-' + i;
            var dim = Math.floor(Math.random() * 9) * 5 + 40;
            var topPos = Math.random() * this.state.pageHeight;
            squaresList.push(
                <Square
                    width={dim}
                    height={dim}
                    top={topPos}
                    left={Math.floor(Math.random() * this.state.pageWidth)}
                    sOpacity={
                        topPos - 300 < 0 ? (
                            0.28
                        ) : (
                            (height - topPos) / (height - 300) * 0.23 + 0.05
                        )
                    }
                    key={i}
                >
                    <rect id={id} x="0" y="0" width={dim} height={dim} />
                </Square>
            );
        }
        return squaresList;
    }

    render() {
        return (
            <RelativeContainer>
                <Wrapper
                    width={this.state.pageWidth}
                    height={this.state.pageHeight}
                >
                    {this.randomSquares()}
                </Wrapper>
            </RelativeContainer>
        );
    }
}

export default Animations;
