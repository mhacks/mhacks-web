import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { devices } from '../../styles';

import AiMl from '../../../static/mx/ai-ml.png';
import Android from '../../../static/mx/android.png';
import ArVr from '../../../static/mx/ar-vr.png';
import GameDev from '../../../static/mx/game-dev.png';
import Hardware from '../../../static/mx/hardware.png';
import Ios from '../../../static/mx/ios.png';
import WebDev from '../../../static/mx/web-dev.png';

const Wrapper = styled.div`
    backgroundColor: ${props => props.theme.secondary};
    color: ${props => props.theme.highlight};
    paddingTop: 80px;
    paddingBottom: 40px;
`;

const Container = styled.div`
    width: calc(100% - 60px);
    maxWidth: 800px;
    margin: 0 auto;

    ${devices.tablet`
        width: calc(100% - 100px);
    `}

    ${devices.desktop`
        width: calc(100% - 140px);
    `}

    ${devices.giant`
        width: calc(100% - 160px);
    `}
`;

const SectionHeader = styled.h2`
    display: block;
    fontSize: 48px;
    textTransform: uppercase;
    fontWeight: 500;
    margin: 20px 20px 20px 20px;
    min-width: 100%;

    ${devices.tablet`
        marginLeft: 60px;
        min-width: calc(66.666% - 80px);
    `}
`;

const Flexbox = styled.div`
    display: flex;
    flexWrap: wrap;
    justifyContent: space-between;
`;

const Flex1 = styled.div`
    display: flex;
    flexDirection: column;
    justifyContent: flex-end;
    alignItems: center;
    width: calc(50% - 40px);
    margin: 20px;
    marginBottom: 40px;

    ${devices.tablet`
        width: calc(33.333% - 40px); 
    `}
`;

const Img100 = styled.img`
    width: auto;
    height: auto;
    max-width: 140px;
    max-height: 80px;
`;

const Caption = styled.p`
    display: block;
    fontSize: 16px;
    textAlign: center;
`;

class HackingCategories extends React.Component {
    render() {
        return (
            <Wrapper>
                <Container>
                    <Flexbox>
                        <SectionHeader>Hacking <br />Cortices</SectionHeader>
                        <Flex1>
                            <Img100 src={Hardware} />
                            <Caption>Hardware</Caption>
                        </Flex1>
                        <Flex1>
                            <Img100 src={AiMl} />
                            <Caption>AI/ML</Caption>
                        </Flex1>
                        <Flex1>
                            <Img100 src={ArVr} />
                            <Caption>AR/VR</Caption>
                        </Flex1>
                        <Flex1>
                            <Img100 src={GameDev} />
                            <Caption>Game <br />Development</Caption>
                        </Flex1>
                        <Flex1>
                            <Img100 src={Ios} />
                            <Caption>iOS <br />Development</Caption>
                        </Flex1>
                        <Flex1>
                            <Img100 src={WebDev} />
                            <Caption>Web <br />Development</Caption>
                        </Flex1>
                        <Flex1>
                            <Img100 src={Android} />
                            <Caption>Android <br />Development</Caption>
                        </Flex1>
                    </Flexbox>
                </Container>
            </Wrapper>
        );
    }
}

const mapStateToProps = state => ({
    theme: state.theme.data
});

export default connect(mapStateToProps)(HackingCategories);
