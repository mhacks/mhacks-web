import React from 'react';
import styled from 'styled-components';
import { devices } from '../../../styles';

export const HeaderSection = styled.div`
    display: flex;
    flexDirection: column;
    justifyContent: space-between;
    padding: 10px 20px;

    ${devices.tablet`
        flexDirection: row;

        form {
            flex: 1;

            &:first-child {
                marginRight: 40px;
            }
        }
    `};
`;

export const SubsectionContainer = styled.div`
    display: flex;
    flexDirection: row;
    padding: 0 20px;
`;

const UtilityContainer = styled.div`
    padding: 0 20px;
    display: flex;
    flexWrap: wrap;
`;

const UtilityButton = styled.button`
    borderRadius: 20px;
    backgroundColor: transparent;
    color: ${props => props.color};
    fontWeight: 500;
    fontSize: 16px;
    padding: 8px 20px;
    border: 3px solid ${props => props.color};
    margin: 20px 20px 20px 0;

    &:hover {
        backgroundColor: ${props => props.color};
        color: white;
    }

    &:last-child {
        marginRight: 0;
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
