var router = require('express').Router(),
    Shortener = require('../db/model/Shortener.js'),
    config = require('../../config/default.js');

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

module.exports = router;
