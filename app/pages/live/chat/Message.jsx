import React from 'react';
import styled from 'styled-components';
import { FormattedRelative } from 'react-intl';
//import { ProfilePicture } from '../../components';

const ListItemHeader = styled.h2`
    color: ${props => props.theme.highlight};
    margin: 0;
    fontSize: 20px;
    fontWeight: bold;
    display: flex;
    justify-content: space-between;
`;

const ListItemTimestamp = styled.p`
    fontWeight: bold;
    marginTop: 7px;
    color: ${props => props.theme.highlight};
`;

const ListItemDescription = styled.p`color: white;`;

const Seperator = styled.div`
    background: ${props => props.theme.highlight};
    height: 2px;
    margin: 15px 20px 15px 0;
`;

const DM = styled.button`
    border: 2px solid ${props => props.theme.highlight};
    font-size: 14px;
    padding: 8px 20px;
    border-radius: 8px;
    text-transform: uppercase;
    background-color: transparent;
    color: ${props => props.theme.highlight};

    &:hover {
        color: white;
        background-color: ${props => props.theme.highlight};
    }
`;

class Message extends React.Component {
    render() {
        const { message, isLast } = this.props;

        return (
            <div id={isLast ? 'lastMessage' : ''}>
                <ListItemHeader theme={this.props.theme}>
                    {message.user.name}
                    <DM onClick={this.props.onStartDM} theme={this.props.theme}>
                        Start DM
                    </DM>
                </ListItemHeader>
                <ListItemTimestamp theme={this.props.theme}>
                    <FormattedRelative value={message.time} />
                </ListItemTimestamp>
                <ListItemDescription theme={this.props.theme}>
                    {message.message}
                </ListItemDescription>
                <Seperator />
            </div>
        );
    }
}

export default Message;
