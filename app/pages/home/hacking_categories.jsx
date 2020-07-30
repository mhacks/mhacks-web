import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { devices } from '../../styles';
import theme from '../../styles/theme';

const Images = {
    'AI/ML': require('../../../static/m12/cortices/ai.svg'),
    'Android <br />Development': require('../../../static/m12/cortices/android.svg'),
    'AR/VR': require('../../../static/m12/cortices/vr.svg'),
    'Game <br />Development': require('../../../static/m12/cortices/game.svg'),
    Hardware: require('../../../static/m12/cortices/hardware.svg'),
    'iOS <br />Development': require('../../../static/m12/cortices/ios.svg'),
    'Web <br />Development': require('../../../static/m12/cortices/web.svg')
};

const Wrapper = styled.div`
    background-color: white;
    color: ${props => props.theme.highlight};
    margin: 0 20px;
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
    font-weight: 900;
    margin: 0px 20px 20px 20px;
    min-width: 100%;
    text-align: center;
    color: ${theme.highlight};
`;

const Flexbox = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

const Flex1 = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    width: calc(25% - 40px);
    margin: 20px;
    margin-bottom: 40px;
    flex-basis: 20%;
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
    color: ${theme.primary};
`;

class HackingCategories extends React.Component {
    render() {
        return (
            <Wrapper style={{ backgroundColor: this.props.backgroundColor }}>
                <Container>
                    <Flexbox>
                        <SectionHeader>Hacking Cortices</SectionHeader>
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
