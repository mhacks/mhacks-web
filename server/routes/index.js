var router = require('express').Router();

router.get('/index', function(req, res) {
    res.send(`
<html>
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io.connect('http://localhost:3000/chat');
</script>
</html>
`);
});

module.exports = router;
