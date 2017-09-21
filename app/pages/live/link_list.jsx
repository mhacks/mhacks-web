import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { devices } from '../../styles';

import Components from './components.jsx';
const { SectionWrapper } = Components;

const P = styled.p`
    text-transform: uppercase;
    color: ${props => props.theme.highlight};
    margin: 0;
    text-align: center;
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
    
    ${devices.tablet`
        width: 140px;
        margin-right: 20px;

        &:last-child {
            margin-right: 0;
        }
    `};
`;

class LinkList extends React.Component {
    render() {
        const links = [
            {
                title: 'Livestream',
                link: 'https://maps.google.com'
            },
            {
                title: 'Devpost',
                link: 'https://maps.google.com'
            },
            {
                title: 'Mentorship',
                link: 'https://maps.google.com'
            },
            {
                title: 'Resources',
                link: 'https://maps.google.com'
            },
            {
                title: 'Hardware',
                link: 'https://maps.google.com'
            }
        ];

        return (
            <ListContainer>
                {links.map((link, index) => {
                    return (
                        <StyledSectionWrapper
                            key={index}
                            theme={this.props.theme}
                        >
                            <P theme={this.props.theme}>
                                {link.title}
                            </P>
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