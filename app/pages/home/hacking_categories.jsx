import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { devices } from '../../styles';

const Images = {
    'AI/ML': require('../../../static/mx/ai-ml.png'),
    'Android <br />Development': require('../../../static/mx/android.png'),
    'AR/VR': require('../../../static/mx/ar-vr.png'),
    'Game <br />Development': require('../../../static/mx/game-dev.png'),
    Hardware: require('../../../static/mx/hardware.png'),
    'iOS <br />Development': require('../../../static/mx/ios.png'),
    'Web <br />Development': require('../../../static/mx/web-dev.png')
};

const Wrapper = styled.div`
    background-color: ${props => props.theme.secondary};
    color: ${props => props.theme.highlight};
    padding-top: 80px;
    padding-bottom: 40px;
`;

const Container = styled.div`
    width: calc(100% - 60px);
    max-width: 800px;
    margin: 0 auto;

    ${devices.tablet`
        width: calc(100% - 100px);
    `} ${devices.desktop`
        width: calc(100% - 140px);
    `} ${devices.giant`
        width: calc(100% - 160px);
    `};
`;

const SectionHeader = styled.h2`
    display: block;
    font-size: 48px;
    text-transform: uppercase;
    font-weight: 500;
    margin: 20px 20px 20px 20px;
    min-width: 100%;

    ${devices.tablet`
        margin-left: 60px;
        min-width: calc(66.666% - 80px);
    `};
`;

const Flexbox = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Flex1 = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    width: calc(50% - 40px);
    margin: 20px;
    marginb-bttom: 40px;

    ${devices.tablet`
        width: calc(33.333% - 40px); 
    `};
`;

const Img100 = styled.img`
    width: auto;
    height: auto;
    max-width: 140px;
    max-height: 80px;
`;

const Caption = styled.p`
    display: block;
    font-size: 16px;
    text-align: center;
`;

class HackingCategories extends React.Component {
    render() {
        return (
            <Wrapper>
                <Container>
                    <Flexbox>
                        <SectionHeader>
                            Hacking <br />Cortices
                        </SectionHeader>
                        {Object.keys(Images).map(function(name, index) {
                            return (
                                <Flex1 key={index}>
                                    <Img100 src={Images[name]} />
                                    <Caption
                                        dangerouslySetInnerHTML={{
                                            __html: name
                                        }}
                                    />
                                </Flex1>
                            );
                        })}
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
