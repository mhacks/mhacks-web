import React from 'react';
import styled from 'styled-components';
import theme from '../styles/theme.js';

const Timer = styled.p`
    color: ${theme.highlight};
    font-weight: bold;
    font-size: 30px;
    padding: 20px 0;
    margin: 0;
    text-align: center;
`;

class Countdown extends React.Component {
    componentDidMount() {
        this.timerFunction = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerFunction);
    }

    updateCountdown() {
        this.forceUpdate();
    }

    generateDateTimestamp() {
        if (Date.parse(this.props.date) < Date.now()) {
            clearInterval(this.timerFunction);
            return this.props.fallback;
        } else {
            const t = Date.parse(this.props.date) - Date.parse(new Date());

            const seconds = ('0' + Math.floor((t / 1000) % 60)).slice(-2);
            const minutes = ('0' + Math.floor((t / 1000 / 60) % 60)).slice(-2);
            const hours = ('0' + Math.floor((t / (1000 * 60 * 60)) % 24)).slice(
                -2
            );
            const days = ('0' + Math.floor(t / (1000 * 60 * 60 * 24))).slice(
                -2
            );

            return [days, hours, minutes, seconds].join(':');
        }
    }

    render() {
        return <Timer>{this.generateDateTimestamp()}</Timer>;
    }
}

export default Countdown;
