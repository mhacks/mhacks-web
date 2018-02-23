import React from 'react';
import styled from 'styled-components';
import { devices } from '../../../styles';

export const HeaderSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 20px;

    ${devices.tablet`
        flex-direction: row;

        form {
            flex: 1;

            &:first-child {
                margin-right: 40px;
            }
        }
    `};
`;

export const SubsectionContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0 20px;
`;

const UtilityContainer = styled.div`
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
`;

const UtilityButton = styled.button`
    border-radius: 20px;
    background-color: transparent;
    color: ${props => props.color};
    font-weight: 500;
    font-size: 16px;
    padding: 8px 20px;
    border: 3px solid ${props => props.color};
    margin: 20px 20px 20px 0;

    &:hover {
        background-color: ${props => props.color};
        color: white;
    }

    &:last-child {
        margin-right: 0;
    }
`;

export class UtilityBar extends React.Component {
    render() {
        return (
            <UtilityContainer>
                {this.props.utilities.map(utility => {
                    return (
                        <UtilityButton
                            color={this.props.theme.primary}
                            key={utility.title}
                            onClick={utility.onClick}
                        >
                            {utility.title}
                        </UtilityButton>
                    );
                })}
            </UtilityContainer>
        );
    }
}
