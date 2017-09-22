import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { devices } from '../../styles';

import Components from './components.jsx';
const { SectionWrapper } = Components;

const A = styled.a`
    text-decoration: none;
    text-transform: uppercase;
    margin: 0;
    text-align: center;
    display: block;
`;

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;

    ${devices.tablet`
        flex-direction: row;
        justify-content: center;
    `};
`;

const StyledSectionWrapper = styled(SectionWrapper)`
    width: 100%;
    margin-bottom: 20px;
    color: ${props => props.theme.highlight};

    ${devices.tablet`
        width: 140px;
        margin-right: 20px;

        &:last-child {
            margin-right: 0;
        }
    `};

    &:hover {
        cursor: pointer;
        color: white;
    }
`;

class LinkList extends React.Component {
    render() {
        const links = [
            {
                title: 'Livestream',
                onClick: () => {
                    window.open(
                        'https://www.youtube.com/user/mhacksf13',
                        '_blank'
                    );
                }
            },
            {
                title: 'Devpost',
                onClick: () => {
                    window.open('https://mhacksx.devpost.com/', '_blank');
                }
            },
            {
                title: 'Mentorship',
                onClick: () => {
                    document.getElementById('mentorship').scrollIntoView(false);
                }
            },
            {
                title: 'Hardware',
                onClick: () => {
                    document.getElementById('hardware').scrollIntoView(false);
                }
            },
            {
                title: 'Resources',
                onClick: () => {
                    document.getElementById('resources').scrollIntoView(false);
                }
            }
        ];

        return (
            <ListContainer>
                {links.map((link, index) => {
                    return (
                        <StyledSectionWrapper
                            key={index}
                            theme={this.props.theme}
                            onClick={link.onClick}
                        >
                            <A theme={this.props.theme}>{link.title}</A>
                        </StyledSectionWrapper>
                    );
                })}
            </ListContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(LinkList);
