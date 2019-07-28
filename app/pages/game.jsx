import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { GameThunks } from '../actions';
import { PageContainer } from '../components';
import PropTypes from 'prop-types';
import { FieldTypes } from '../constants/forms.js';

import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';
import { MHForm } from '../components';

const FormContainer = styled.div`
    max-width: 500px;
    margin: 0 auto;
    min-height: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 20px 50px 20px;
`;

const SectionHeader = styled.h2`
    font-size: 40px;
    color: ${props => props.color};
    font-weight: 500;
    margin: 0;
`;

const Subhead = styled.p`
    margin: 20px 0 0 0;
    color: ${props => props.theme.secondary};
`;

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: OrderedSet()
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    addNotification(message, key, action) {
        return this.setState({
            notifications: this.state.notifications.add({
                message,
                key,
                action: action || 'Dismiss',
                onClick: (notification, deactivate) => {
                    deactivate();
                    this.removeNotification(key);
                }
            })
        });
    }

    removeNotification(key) {
        this.setState({
            notifications: this.state.notifications.filter(n => n.key !== key)
        });
    }

    componentDidMount() {
        this.props.dispatch(GameThunks.loadQuestions());
        this.props.dispatch(GameThunks.loadGameState());
    }

    onSubmit(answers) {
        this.props
            .dispatch(GameThunks.uploadAnswers(answers))
            .then(() => this.addNotification('Answers Saved!', 'save'));
    }

    render() {
        return (
            <PageContainer>
                <FormContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        SiMHacks Questionnaire
                    </SectionHeader>
                    <div>
                        <Subhead>
                            Welcome to the SiMHacks questionnaire! SiMHacks is a
                            minigame within MHacks 12 in which hackers can earn
                            points for finding other hackers with certain
                            interests and getting to know them a bit more! To
                            begin, fill out the questions below, and when MHacks
                            12 rolls around come with your spidey senses ready!
                        </Subhead>
                        <MHForm
                            schema={this.props.questions}
                            initialData={this.props.answers}
                            theme={this.props.theme}
                            onSubmit={this.onSubmit}
                        />
                    </div>
                </FormContainer>
                <NotificationStack
                    notifications={this.state.notifications.toArray()}
                    onDismiss={notification =>
                        this.setState({
                            notifications: this.state.notifications.delete(
                                notification
                            )
                        })
                    }
                    activeBarStyleFactory={(index, style) => {
                        return Object.assign(
                            {},
                            style,
                            { bottom: `${2 + index * 4}rem` },
                            { zIndex: 10000 }
                        );
                    }}
                    dismissAfter={5000}
                />
            </PageContainer>
        );
    }
}

Game.contextTypes = {
    router: PropTypes.object
};

function mapStateToProps(state) {
    var questions = {};
    state.gameState.data.questions.forEach(
        question =>
            (questions[question.name] = {
                key: question.name,
                label: question.text,
                type: FieldTypes.SELECT,
                select: question.options.map(option => ({
                    label: option,
                    value: option,
                    type: FieldTypes.TEXT
                })),
                required: true
            })
    );

    questions['save'] = {
        label: 'Save',
        type: FieldTypes.SUBMIT
    };

    return {
        theme: state.theme.data,
        configurationState: state.configurationState,
        questions: questions,
        answers: state.gameState.data.state.answers
    };
}

export default connect(mapStateToProps)(Game);
