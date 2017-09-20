var router = require('express').Router(),
    mongoose = require('mongoose'),
    MentorshipTicket = require('../../db/model/MentorshipTicket.js'),
    authMiddleware = require('../../middleware/auth.js'),
    Responses = require('../../responses/api/announcement.js');

// Handles get requests for /v1/mentorship/
router.get('/', authMiddleware('any', 'api'), function(req, res) {
    // TODO: Add an or operator to only grab complete tickets from the database tha
    // that are the requesting user tickets.
    MentorshipTicket.find()
        .populate('requestor', 'full_name email')
        .then(tickets => {
            res.send({
                status: true,
                user: tickets.filter(
                    ticket => ticket.requestor.id === req.user.id
                ),
                available: tickets.filter(
                    ticket =>
                        ticket.mentor === undefined &&
                        ticket.is_complete === false &&
                        ticket.requestor.id !== req.user.id
                ),
                accepted: tickets.filter(
                    ticket =>
                        ticket.mentor !== undefined &&
                        ticket.is_complete === false &&
                        ticket.requestor.id !== req.user.id
                )
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

// Handles post requests for /v1/mentorship/
router.post('/', authMiddleware('any', 'api'), function(req, res) {
    const { skills, title, body, location_description } = req.body;

    if (
        skills === undefined ||
        title === undefined ||
        body === undefined ||
        location_description === undefined
    ) {
        res.status(401).send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });
    } else {
        MentorshipTicket.findOne({
            requestor: req.user,
            is_complete: false
        }).then(existingTicket => {
            if (existingTicket) {
                res.status(401).send({
                    status: false,
                    message: Responses.Mentorship.ONE_TICKET
                });

                return;
            }

            MentorshipTicket.create({
                requestor: req.user,
                skills,
                title,
                body,
                location_description
            })
                .then(ticket => {
                    res.send({
                        status: true,
                        ticket: ticket.toJSON()
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send({
                        status: false,
                        message: Responses.UNKNOWN_ERROR
                    });
                });
        });
    }
});

router.post('/complete', authMiddleware('any', 'api'), function(req, res) {
    const { ticket } = req.body;

    if (ticket === undefined) {
        res.status(401).send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });

        return;
    }

    MentorshipTicket.findById(ticket)
        .then(ticket => {
            if (ticket === null) {
                res.status(404).send({
                    status: false,
                    message: Responses.NOT_FOUND
                });

                return;
            }

            const requestorId = mongoose.Types.ObjectId(ticket.requestor);
            const userId = mongoose.Types.ObjectId(req.user.id);

            if (
                !requestorId.equals(userId) &&
                !req.user.groups.contains('admin')
            ) {
                res.status(401).send({
                    status: false,
                    message: Responses.Auth.UNAUTHORIZED
                });

                return;
            }

            ticket.is_complete = true;
            ticket.save();

            res.send({
                status: true
            });
        })
        .catch(err => {
            console.error(err);

            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

router.post('/accept', authMiddleware('any', 'api'), function(req, res) {
    const { ticket } = req.body;

    if (ticket === undefined) {
        res.status(403).send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });

        return;
    }

    MentorshipTicket.findById(ticket)
        .then(ticket => {
            if (ticket === null) {
                res.status(404).send({
                    status: false,
                    message: Responses.NOT_FOUND
                });

                return;
            }

            if (ticket.mentor !== undefined) {
                res.status(403).send({
                    status: false,
                    message: Responses.MENTOR_ALREADY_ASSIGNED
                });

                return;
            }

            ticket.mentor = req.user;
            ticket.save();

            res.send({
                status: true,
                ticket
            });
        })
        .catch(err => {
            console.error(err);

            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

router.post('/unaccept', authMiddleware('any', 'api'), function(req, res) {
    const { ticket } = req.body;

    if (ticket === undefined) {
        res.status(403).send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });

        return;
    }

    MentorshipTicket.findById(ticket)
        .then(ticket => {
            if (ticket === null) {
                res.status(404).send({
                    status: false,
                    message: Responses.NOT_FOUND
                });

                return;
            }

            ticket.mentor = undefined;
            ticket.save();

            res.send({
                status: true,
                ticket
            });
        })
        .catch(err => {
            console.error(err);

            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

module.exports = router;
