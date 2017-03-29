var router = require('express').Router();

router.get('/', function(req, res) {
    res.send("admin/");
});

module.exports = router;