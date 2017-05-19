var router = require('express').Router(),
    authMiddleware = require('../middleware/auth.js');

router.get('/', authMiddleware('api', false), function(req, res) {
    res.send('admin/');
});

module.exports = router;