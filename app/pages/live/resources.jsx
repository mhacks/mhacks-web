import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Components from './components.jsx';
const { SectionWrapper, SectionHeader } = Components;

const P = styled.p`
    color: ${props => props.theme.highlight};
`;

const A = styled.a`
    color: white;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

class Resources extends React.Component {
    render() {
        return (
            <SectionWrapper theme={this.props.theme} id="resources">
                <SectionHeader>Resources</SectionHeader>
                <P theme={this.props.theme}>
                    <A href="https://bento.io/">Cheats to the World</A> <br />{' '}
                    <A href="https://www.fullstackpython.com/best-python-resources.html">
                        Learning Python
                    </A>{' '}
                    <br />{' '}
                    <A href="https://github.com/vinta/awesome-python">
                        Python Frameworks/Libraries
                    </A>{' '}
                    <br />{' '}
                    <A href="http://webdesignfromscratch.com/category/html-css/">
                        HTML/CSS Resources
                    </A>{' '}
                    <br />
                    <A href="https://kotlinlang.org/docs/reference/basic-syntax.html">
                        Android (Kotlin) Resources
                    </A>{' '}
                    <br />
                    <A href="https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/TheBasics.html#//apple_ref/doc/uid/TP40014097-CH5-ID309">
                        iOS Resources
                    </A>{' '}
                    <br />
                    <A href="https://unity3d.com/learn/tutorials">
                        Unity Resources
                    </A>{' '}
                    <br />
                    <A href="https://www.youtube.com/playlist?list=PLrgQj91MOVfjTShOMRY8TLmkJ7OFr7bj6">
                        Blender Resources
                    </A>{' '}
                    <br />
                    <A href="http://buildwithreact.com/">
                        React.js Resources
                    </A>{' '}
                    <br />
                    <A href="https://www.codeschool.com/courses/real-time-web-with-node-js">
                        Node.js Resources
                    </A>{' '}
                    <br />
                    <A href="http://webdesignfromscratch.com/category/web-design/">
                        Graphic Design Resources
                    </A>{' '}
                    <br />
                </P>
            </SectionWrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Resources);
