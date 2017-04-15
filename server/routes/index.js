var router = require('express').Router();

router.get('/index', function(req, res) {
    res.send('index/');
});

module.exports = router;
