var router = require('express').Router(),
    authMiddleware = require('../../middleware/auth.js'),
    Shortener = require('../../db/model/Shortener.js'),
    Responses = require('../../responses/api/index.js'),
    config = require('../../../config/default.js'),
    max = 5,
    current = 0,
    interval = undefined;

router.get('/', authMiddleware('admin', 'api'), function(req, res) {
    Shortener.find({})
        .exec()
        .then(short_urls => {
            res.send({
                status: true,
                short_urls: short_urls
            });
        })
        .catch(err => {
            res.send({
                status: false,
                message: err
            });
        });
});

router.post('/', authMiddleware('admin', 'api'), function(req, res) {
    if (req.body.url) {
        createShortenedURL(req.body.short_code, req.body.url, res);
    } else {
        res.send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });
    }
});

router.get('/:id', function(req, res) {
    if (req.params.id) {
        Shortener.find()
            .byShortCode(req.params.id)
            .exec()
            .then(short_url => {
                if (short_url) {
                    res.redirect(short_url.long_url);
                    short_url.click(req.headers['x-forwarded-for'] || req.ip);
                } else {
                    res.redirect(config.host);
                }
            })
            .catch(() => {
                res.redirect(config.host);
            });
    }
});

// Async/Await pls
function createShortenedURL(short_code, long_url, res) {
    if (!interval) {
        interval = setInterval(function() {
            createShortenedURL(short_code, long_url, res);
        }, 500);
    }

    var create_fields = {
        long_url: long_url
    };

    if (short_code) {
        create_fields.short_code = short_code;
    }

    Shortener.create(create_fields)
        .then(short_url => {
            if (short_url) {
                res.send({
                    status: true,
                    short_url: short_url,
                    url: short_url.getUrl()
                });
            } else {
                res.send({
                    status: false,
                    message: Responses.Shortener.ERROR
                });
            }
            clearInterval(interval);
        })
        .catch(() => {
            if (current < max) {
                current++;
            } else {
                clearInterval(interval);

                res.send({
                    status: false,
                    message: Responses.Shortener.ERROR
                });
            }
        });
}

module.exports = router;
