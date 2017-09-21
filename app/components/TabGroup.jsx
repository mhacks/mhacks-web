import React from 'react';
import styled from 'styled-components';
import { devices } from '../styles';

const Group = styled.div`
    display: flex;
    flexDirection: row;
    padding: 0;
    margin: 0;
`;

const TabItem = styled.div`
    flex: 1;
    textAlign: center;
    backgroundColor: ${props =>
        props.active ? props.activeColor : 'transparent'};
    border: 3px solid ${props => props.activeColor};
    borderRight: none;
    color: ${props => (props.active ? 'white' : props.activeColor)};
    padding: 10px 0;
    fontSize: 15px;
    fontWeight: 500;

    &:first-child {
        borderTopLeftRadius: 20px;
        borderBottomLeftRadius: 20px;
    }

    &:last-child {
        borderTopRightRadius: 20px;
        borderBottomRightRadius: 20px;
        borderRight: 3px solid ${props => props.activeColor};
    }

    &:hover {
        backgroundColor: ${props => props.activeColor};
        color: white;
    }

    ${devices.tablet`
        fontSize: 18px;
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
