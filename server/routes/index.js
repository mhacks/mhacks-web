var router = require('express').Router();

router.get('/index', function(req, res) {
    res.send(`
<html>
<script src="/socket.io/socket.io.js"></script>
<script>

    var profileData = null,
        socket = null;

    connect();

    function connect() {
        socket = io.connect('http://localhost:3000', {
            reconnection: false
        });

        socket.on('authenticate', function(data) {
            console.log('Authenticate', data);
            if (!data) {
                authenticate(socket, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFobWlrYUB1bWljaC5lZHUiLCJpYXQiOjE0OTYxODA2MDAsImV4cCI6MTQ5NzM5MDIwMH0.C3OPgabg6fSSnKeL8oi3TnrY2wXpkIT6Fa_75_252NA')
            } else {
                retrieveProfile(socket);
            }
        });

        socket.on('status', function(data) {
            console.log('Status', data);
        });

        socket.on('chat', function(data) {
            console.log('Chat', data);
        })
    }

    function retrieveProfile(socket) {
        socket.emit('profile');

        socket.on('profile', function(data) {
            console.log('Profile', data);
            profileData = data;
        });
    }

    function authenticate(socket, token) {
        socket.emit('authenticate', {
            token: token
        });
    }
</script>
</html>
`);
});

module.exports = router;
