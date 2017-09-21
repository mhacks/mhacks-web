import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Components from './components.jsx';
const { SectionWrapper } = Components;

const P = styled.p`color: ${props => props.theme.highlight};`;

const ListContainer = styled.div`
    display: flex;
    flexDirection: horizontal;
`;

class LinkList extends React.Component {
    render() {
        const links = [
            {
                title: 'Map',
                link: 'https://maps.google.com'
            },
            {
                title: 'Livestream',
                link: 'https://maps.google.com'
            }
        ];

        return (
            <ListContainer>
                {links.map((link, index) => {
                    return (
                        <SectionWrapper
                            key={index}
                            theme={this.props.theme}
                        >
                            <P theme={this.props.theme}>
                                {link.title}
                            </P>
                        </SectionWrapper>
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