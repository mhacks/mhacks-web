var router = require('express').Router();

router.get('/', function(req, res) {
    res.send("index/");
});

module.exports = router;
