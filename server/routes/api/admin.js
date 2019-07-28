var router = require('express').Router(),
    User = require('../../db/model/User.js'),
    Configuration = require('../../db/model/Configuration.js'),
    Floor = require('../../db/model/Floor.js'),
    Location = require('../../db/model/Location.js'),
    Announcement = require('../../db/model/Announcement.js'),
    Event = require('../../db/model/Event.js'),
    Sponsor = require('../../db/model/Sponsor.js'),
    Scan = require('../../db/model/Scan.js'),
    ScanEvent = require('../../db/model/ScanEvent.js'),
    Team = require('../../db/model/Team.js'),
    MentorshipTicket = require('../../db/model/MentorshipTicket.js'),
    Application = require('../../db/model/Application.js'),
    Confirmation = require('../../db/model/Confirmation.js'),
    GameState = require('../../db/model/GameState.js'),
    Device = require('../../db/model/Device.js'),
    PushNotification = require('../../db/model/PushNotification.js'),
    Shortener = require('../../db/model/Shortener.js'),
    config = require('../../../config/default.js'),
    uploadHelper = require('../../interactors/multer-s3.js')(
        config.AWS_BUCKET_NAME,
        true
    ),
    Responses = require('../../responses/api/index.js');

const models = {
    Configurations: Configuration,

    Floors: Floor,
    Locations: Location,
    Events: Event,

    Scans: Scan,
    ScanEvents: ScanEvent,

    Users: User,
    Applications: Application,
    Confirmations: Confirmation,
    GameStates: GameState,

    Teams: Team,
    MentorshipTickets: MentorshipTicket,
    Sponsors: Sponsor,

    Announcements: Announcement,
    Devices: Device,
    PushNotifications: PushNotification,

    Shorteners: Shortener
};

router.get('/model', function(req, res) {
    res.send({
        status: true,
        models: Object.keys(models)
    });
});

router.get('/model/:model', function(req, res) {
    const model = models[req.params.model];

    if (model === undefined) {
        res.status(404).send({
            status: false,
            message: Responses.NOT_FOUND
        });

        return;
    }

    model
        .find()
        .select(req.params.model === 'Users' ? '-password' : '')
        .then(documents => {
            res.send({
                status: true,
                documents
            });
        })
        .catch(err => {
            console.error(err);
            res.status(404).send({
                status: false,
                message: Responses.NOT_FOUND
            });
        });
});

router.get('/model/:model/:id', function(req, res) {
    const model = models[req.params.model];

    if (model === undefined) {
        res.status(404).send({
            status: false,
            message: Responses.NOT_FOUND
        });

        return;
    }

    if (req.params.id === 'create') {
        res.send({
            status: true,
            document: {}
        });

        return;
    }

    model
        .findById(req.params.id)
        .select(req.params.model === 'Users' ? '-password' : '')
        .then(document => {
            document = document.toObject();

            for (var i in document) {
                if (Array.isArray(document[i])) {
                    if (req.params.model === 'Users' && i === 'groups') {
                        document.groups = document.groups.map(function(data) {
                            return { label: data.name, value: data.name };
                        });
                    } else {
                        document[i] = document[i].map(function(data) {
                            return { label: data, value: data };
                        });
                    }
                }
            }

            res.send({
                status: true,
                document: document
            });
        })
        .catch(err => {
            console.error(err);
            res.status(404).send({
                status: false,
                message: Responses.NOT_FOUND
            });
        });
});

router.post(
    '/model/:model/:id',
    uploadHelper.fields([
        { name: 'logo' },
        { name: 'avatar' },
        { name: 'resume' },
        { name: 'floor_image' }
    ]),
    function(req, res) {
        const Model = models[req.params.model];

        if (req.files && req.files.logo) {
            req.body.logo =
                req.files.logo[0].location ||
                '/uploads/' + req.files.logo[0].filename;
        }

        if (req.files && req.files.avatar) {
            req.body.avatar =
                req.files.avatar[0].location ||
                '/uploads/' + req.files.avatar[0].filename;
        }

        if (req.files && req.files.resume) {
            req.body.resume =
                req.files.resume[0].location ||
                '/uploads/' + req.files.resume[0].filename;
        }

        if (req.files && req.files.floor_image) {
            req.body.floor_image =
                req.files.floor_image[0].location ||
                '/uploads/' + req.files.floor_image[0].filename;
        }

        if (Model === undefined) {
            res.status(404).send({
                status: false,
                message: Responses.NOT_FOUND
            });

            return;
        }

        const updateableFields = Model.getUpdateableFields(req.groups);
        const fields = {};

        for (const i in req.body) {
            if (updateableFields.indexOf(i) !== -1) {
                if (req.params.model === 'Users' && i === 'groups') {
                    if (req.body[i].trim().length === 0) {
                        fields[i] = [];
                    } else {
                        fields[i] = req.body[i].split(',').map(function(data) {
                            return { name: data };
                        });
                    }
                } else if (
                    (req.params.model === 'Users' &&
                        i === 'password' &&
                        !req.body[i]) ||
                    (req.params.model === 'Shorteners' &&
                        i === 'short_code' &&
                        !req.body[i]) ||
                    (req.params.model === 'Devices' &&
                        i === 'user' &&
                        !req.body[i])
                ) {
                    continue;
                } else if (
                    Array.isArray(Model.schema.obj[i].type) ||
                    (('form' in Model.schema.obj[i] &&
                        ('type_override' in Model.schema.obj[i].form &&
                            Model.schema.obj[i].form.type_override ===
                                'array')) ||
                        'array_select' in Model.schema.obj[i].form)
                ) {
                    if (req.body[i]) {
                        fields[i] = req.body[i].split(',');
                    } else {
                        fields[i] = [];
                    }
                } else {
                    fields[i] = req.body[i];
                }
            }
        }

        if (req.params.id && req.params.id !== 'create') {
            Model.findById(req.params.id)
                .then(document => {
                    if (document) {
                        document
                            .updateFields(fields, req.groups)
                            .then(document => {
                                res.send({
                                    status: true,
                                    document
                                });
                            });
                    } else {
                        res.status(404).send({
                            status: false,
                            message: Responses.NOT_FOUND
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send({
                        status: false,
                        message: Responses.UNKNOWN_ERROR
                    });
                });
        } else {
            Model.create(fields)
                .then(document => {
                    res.send({
                        status: true,
                        document
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send({
                        status: false,
                        message: Responses.UNKNOWN_ERROR
                    });
                });
        }
    }
);

router.delete('/model/:model/:id', function(req, res) {
    const Model = models[req.params.model];

    if (Model === undefined) {
        res.status(404).send({
            status: false,
            message: Responses.NOT_FOUND
        });

        return;
    }

    if (req.params.id) {
        Model.findById(req.params.id)
            .then(document => {
                if (document) {
                    document.remove();
                } else {
                    res.status(404).send({
                        status: false,
                        message: Responses.NOT_FOUND
                    });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    } else {
        res.status(404).send({
            status: false,
            message: Responses.NOT_FOUND
        });
    }
});

router.post('/user/groups', function(req, res) {
    if (req.body.email && req.body.group) {
        User.find()
            .byEmail(req.body.email)
            .then(user => {
                if (user) {
                    req.body.group.split(',').forEach(function(group) {
                        if (req.body.remove) {
                            user.removeGroup(group.trim());
                        } else {
                            user.addGroup(group.trim());
                        }
                    });

                    res.send({
                        status: true,
                        user: user
                    });
                } else {
                    res.send({
                        status: false,
                        user: null
                    });
                }
            })
            .catch(err => {
                console.error(err);
                res.send({
                    status: false,
                    user: null
                });
            });
    } else {
        res.send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });
    }
});

module.exports = router;
