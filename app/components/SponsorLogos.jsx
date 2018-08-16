import React from 'react';
import { devices } from '../styles';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { SponsorThunks } from '../actions';

const SponsorsFlexBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    max-width: 1200px;
    justify-content: center;
    align-items: center;
    width: calc(100% - 60px);
    margin: 0 auto;

    ${devices.tablet`
        width: calc(100% - 100px);
    `} ${devices.desktop`
        width: calc(100% - 140px);
    `} ${devices.giant`
        width: calc(100% - 160px);
    `};
`;

const LogoWrapper = styled.div`
    margin: 25px;
`;

const SmallLogoImg = styled.img`
    height: 40px;
    width: auto;
    max-width: 100%;
`;

const MediumLogoImg = styled.img`
    height: 70px;
    width: auto;
    max-width: 100%;
`;

const LargeLogoImg = styled.img`
    height: 100px;
    width: auto;
    max-width: 100%;
`;

const SmallLogo = props => (
    <LogoWrapper>
        <a href={props.href}>
            <SmallLogoImg src={props.src} />
        </a>
    </LogoWrapper>
);

const MediumLogo = props => (
    <LogoWrapper>
        <a href={props.href}>
            <MediumLogoImg src={props.src} />
        </a>
    </LogoWrapper>
);

const LargeLogo = props => (
    <LogoWrapper>
        <a href={props.href}>
            <LargeLogoImg src={props.src} />
        </a>
    </LogoWrapper>
);

class SponsorLogos extends React.Component {
    constructor() {
        super();

        this.state = {
            sponsorState: {
                data: {}
            }
        };
    }

    componentDidMount() {
        this.props.dispatch(SponsorThunks.loadSponsors());
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            sponsorState: nextProps.sponsorState
        };
    }

    render() {
        if (
            !this.state.sponsorState.data ||
            !this.state.sponsorState.data.sponsors ||
            !this.state.sponsorState.data.sponsorsList
        ) {
            return null;
        }

        var mainComponent = this;

        return (
            <SponsorsFlexBox>
                {this.state.sponsorState.data.sponsorsList.map(function(level) {
                    return mainComponent.state.sponsorState.data.sponsors[
                        level
                    ].map(function(sponsor) {
                        var SizeComponent = null;

                        switch (sponsor.logo_size) {
                            case 'small':
                                SizeComponent = SmallLogo;
                                break;
                            case 'medium':
                                SizeComponent = MediumLogo;
                                break;
                            case 'large':
                                SizeComponent = LargeLogo;
                                break;
                        }

                        return (
                            <SizeComponent
                                key={sponsor.domain}
                                src={sponsor.logo_url}
                                href={sponsor.url}
                            />
                        );
                    });
                })}
            </SponsorsFlexBox>
        );
    }
}

function mapStateToProps(state) {
    return {
        sponsorState: state.sponsorState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(SponsorLogos);
