var router = require('express').Router(), path = require('path');

router.get('/chat', function(req, res) {
    res.sendFile(path.resolve('server/views/chat.html'));
});

module.exports = router;
