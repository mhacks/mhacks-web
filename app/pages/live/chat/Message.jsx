import React from 'react';
import styled from 'styled-components';
import { FormattedRelative } from 'react-intl';
//import { ProfilePicture } from '../../components';

const ListItemHeader = styled.h2`
    color: ${props => props.theme.highlight};
    margin: 0;
    fontSize: 20px;
    fontWeight: bold;
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

class Message extends React.Component {
    render() {
        const { message, isLast } = this.props;

        return (
            <div id={isLast ? 'lastMessage' : ''}>
                <ListItemHeader theme={this.props.theme}>
                    {message.user.name}
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
