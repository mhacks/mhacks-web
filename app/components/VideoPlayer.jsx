import React from 'react';
import styled from 'styled-components';

const PlayButtonImage = require('../../static/icons/play-button.png');

const PlaceholderContainer = styled.div`
    position: relative;

    &:hover {
        cursor: pointer;
    }

    &:hover .play {
        filter: brightness(80%);
    }
`;

const VideoPlaceholder = styled.img`
    width: 100%;
    height: auto;
`;

const VideoPlayerFrame = styled.iframe`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
`;

const PlayButton = styled.img`
    width: 80px;
    height: 80px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -40px;
    margin-top: -40px;
`;

class VideoPlayer extends React.Component {
    constructor() {
        super();

        this.state = { playing: false };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextState.playing != this.state.playing ||
            nextState.imageHeight != this.state.imageHeight ||
            nextState.imageWidth != this.state.imageWidth ||
            nextProps.autoplay != this.props.autoplay ||
            nextProps.showControls != this.props.showControls ||
            nextProps.showVideoDetails != this.props.showVideoDetails ||
            nextProps.videoUrl != this.props.videoUrl ||
            nextProps.placeholderImage != this.props.placeholderImage
        ) {
            return true;
        }

        return false;
    }

    getImageDimensions({ target: img }) {
        this.setState({
            imageHeight: img.offsetHeight,
            imageWidth: img.offsetWidth
        });
    }

    generateUrl() {
        const autoplay = '?autoplay='.concat(this.props.autoplay ? '1' : '0');
        const controls = '&controls='.concat(
            this.props.showControls ? '1' : '0'
        );
        const info = '&showinfo='.concat(
            this.props.showVideoDetails ? '1' : '0'
        );
        const origin = '&origin=http://example.com';

        return this.props.videoUrl + autoplay + controls + info + origin;
    }

    // Generates the dimensions for the video player based on
    // the dimensions of the provided image
    generateAspectRatioMaintainer() {
        const aspectRatio =
            this.state.imageHeight / this.state.imageWidth * 100;
        const AspectRatioMaintainer = styled.div`
            position: relative;
            width: 100%;
            height: 0;
            padding-bottom: ${aspectRatio}%;
        `;

        return (
            <AspectRatioMaintainer>
                <VideoPlayerFrame
                    type="text/html"
                    src={this.generateUrl()}
                    frameBorder="0"
                />
            </AspectRatioMaintainer>
        );
    }

    playVideo() {
        this.setState({
            playing: true
        });
    }

    render() {
        return (
            <div>
                {this.state.playing ? (
                    this.generateAspectRatioMaintainer.bind(this)()
                ) : (
                    <PlaceholderContainer onClick={this.playVideo.bind(this)}>
                        <VideoPlaceholder
                            src={this.props.placeholderImage}
                            onLoad={this.getImageDimensions.bind(this)}
                        />
                        <PlayButton src={PlayButtonImage} className="play" />
                    </PlaceholderContainer>
                )}
            </div>
        );
    }
}

export default VideoPlayer;
