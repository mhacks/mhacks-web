var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema,
        defaultEndSchema
    } = require('../index.js'),
    Questions = require('../../../static/misc/game-questions.json'),
    config = require('../../../config/default.js');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign(
        {},
        defaultSchema,
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                form: {
                    user_editable: false,
                    label: 'User ID'
                }
            },
            answers: {
                type: Map,
                of: String,
                required: true,
                form: {
                    user_editable: false
                }
            },
            points: {
                type: Number,
                default: 0,
                required: true,
                form: {
                    user_editable: false,
                    label: 'Points'
                }
            },
            quests: [
                {
                    type: mongoose.Schema.Types.Mixed,
                    form: {
                        user_editable: false,
                        label: 'Quests'
                    }
                }
            ],
            completedQuests: [
                {
                    type: mongoose.Schema.Types.Mixed,
                    form: {
                        user_editable: false,
                        label: 'Completed Quests'
                    }
                }
            ],
            scans: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    form: {
                        user_editable: false,
                        label: 'Scanned Users'
                    }
                }
            ]
        },
        defaultEndSchema
    ),
    defaultOptions
);

// Allow us to query by token
schema.query.byToken = function(findToken) {
    return mongoose
        .model('User')
        .find()
        .byToken(findToken)
        .then(user => {
            return this.findOne({ user: user });
        })
        .catch(() => {});
};

schema.query.byUser = function(user) {
    return this.findOne({
        user: user
    });
};

// Allow us to query by email
schema.query.byEmail = function(email) {
    return mongoose
        .model('User')
        .find()
        .byEmail(email)
        .then(user => {
            return this.findOne({
                user: user
            });
        })
        .catch(() => {});
};

schema.methods.generateQuest = function() {
    // Get list of questions for which the user already has a quest
    const currentQuestions = this.quests.map(quest => quest.question);

    // Filter out questions that the user already has
    const availableQuestions = Questions.filter(
        question => !currentQuestions.includes(question.name)
    );

    // Pick a random question from the remaining ones
    const question =
        availableQuestions[
            Math.floor(Math.random() * availableQuestions.length)
        ];

    // Pick a random answer for the question
    const answer =
        question.options[Math.floor(Math.random() * question.options.length)];

    return {
        question: question.name,
        answer: answer,
        requiredScans: 1,
        scans: [],
        points: 10
    };
};

schema.methods.fillQuests = function() {
    while (this.quests.length < config.game_max_quests) {
        this.quests.push(this.generateQuest());
    }

    this.markModified('quests');
};

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('GameState', schema);

module.exports = model;
