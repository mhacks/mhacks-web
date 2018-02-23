import React from 'react';
import styled from 'styled-components';
import { devices } from '../styles';

const Group = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0;
    margin: 0;
`;

const TabItem = styled.div`
    flex: 1;
    text-align: center;
    background-color: ${props =>
        props.active ? props.activeColor : 'transparent'};
    border: 3px solid ${props => props.activeColor};
    border-right: none;
    color: ${props => (props.active ? 'white' : props.activeColor)};
    padding: 10px 0;
    font-size: 15px;
    font-weight: 500;

    &:first-child {
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    }

    &:last-child {
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        border-right: 3px solid ${props => props.activeColor};
    }

    &:hover {
        background-color: ${props => props.activeColor};
        color: white;
    }

    ${devices.tablet`
        font-size: 18px;
    `};
`;

class TabGroup extends React.Component {
    constructor(props) {
        super(props);

        this.clickMiddleware = this.clickMiddleware.bind(this);
        this.state = {
            activeIndex: props.defaultIndex || 0
        };
    }

    clickMiddleware(index, func) {
        return () => {
            this.setState({
                activeIndex: index
            });
            func(index);
        };
    }

    render() {
        let tabs = [];

        this.props.tabs.forEach((tab, i) => {
            tabs.push(
                <TabItem
                    key={i}
                    onClick={this.clickMiddleware(i, tab.onClick)}
                    activeColor={this.props.primaryColor}
                    active={i === this.state.activeIndex}
                >
                    {tab.title}
                </TabItem>
            );
        });

        return <Group>{tabs}</Group>;
    }
}

export default TabGroup;
