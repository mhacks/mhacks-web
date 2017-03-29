var router = require('express').Router();

router.get('/', function(req, res) {
    res.send("api/");
});

module.exports = router;