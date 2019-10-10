var router = require('express').Router(),
    config = require('../../../config/default.js'),
    slack = require('../../interactors/slack.js');

const createBlockWithButton = (user_id, user_name, text) => {
    return JSON.stringify([
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: formatInquiry(user_id, text)
            },
            accessory: {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: `Help User @${user_name}`,
                    emoji: true
                },
                value: 'pair_user_with_mentor'
            }
        }
    ]);
};

const formatInquiry = (user_id, text) =>
    `*<@${user_id}> wants help with:* ${text}`;
const strikeThroughInquiry = text => `~${text}~`;

router.post('/', function(req, res) {
    let inquiry = req.body || '';
    if (inquiry.text && inquiry.command == '/helpmewith') {
        slack
            .getUserForID(config.slackbot_token, inquiry.user_id)
            .then(response => {
                slack
                    .sendMessage(config.slackbot_token, {
                        channel: config.slack_mentorship_channel,
                        text: inquiry.user_id, // NOTE: using text object is currently the best way to pass this id, but Slack is phasing out usernames. Check API in future.
                        blocks: createBlockWithButton(
                            inquiry.user_id,
                            response.user.real_name,
                            inquiry.text
                        ) // defines message content and appearance
                    })
                    .then(() => {
                        res.send({
                            response_type: 'ephemeral',
                            text: `Your inquiry: '${inquiry.text}' was sent to the ${config.slack_mentorship_channel} channel`
                        });
                    })
                    .catch(e => {
                        console.error(e);
                        res.status(500).json(e);
                    });
            })
            .catch(e => {
                console.error(e);
                res.status(500).json(e);
            });
    } else {
        res.status(400).send({ status: false });
    }
});

router.post('/interactions/', function(req, res) {
    let body = req.body;
    const payload = JSON.parse(body.payload);

    // find inquiry within formatted slack message block
    const block_id = payload.actions[0].block_id;
    let inquiry = '';
    for (let i = 0; i < payload.message.blocks.length; ++i) {
        if (payload.message.blocks[i].block_id === block_id) {
            inquiry = payload.message.blocks[i].text.text;
            break;
        }
    }

    // Initialize groupdm with mentor, mentee, and bot. Pop from queue.
    const users = [payload.user.id, payload.message.text];
    slack
        .createGroupDM(config.slackbot_token, users)
        .then(response => {
            // Post question in GroupDM.
            slack
                .sendMessage(config.slackbot_token, {
                    channel: response.channel.id,
                    text: `<@${payload.user.id}>,\n\n${inquiry}\n\nThank you for helping!`
                })
                .then(() => {
                    // Cross-out inquiry in mentorship channel
                    slack
                        .sendMessage(payload.response_url, {
                            text: strikeThroughInquiry(inquiry),
                            replace_original: true
                        })
                        .then(response => {
                            if (!response.ok) throw Error(response.error);
                            res.sendStatus(200);
                        });
                });
        })
        .catch(e => {
            res.status(500).json(e);
            return;
        });
});

module.exports = router;
