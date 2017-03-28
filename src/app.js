var http = require('http'),
    morgan = require('morgan'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    session = require('express-session'),
    bodyParser = require('body-parser');

morgan.token('remote-addr', function(req, res) {
    return req.headers['x-forwarded-for'] || req.ip;
});

app.use(morgan("combined"));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', './src/views');
app.set('view cache', false);

app.use(express.static('./src/public'));
app.use(session({
    secret: process.env.SECRET || 'mhacks',
    resave: true,
    saveUninitialized: true
}));

app.get('/', function(req, res) {
    res.render('index', {
        title: 'Hello,',
        message: 'World!'
    });
});

server.listen(process.env.PORT || 8080);