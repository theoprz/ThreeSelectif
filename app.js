const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

mongoose.connect("mongodb://admin:stillnix@vmi779869.contaboserver.net:27017/ThreeSelectif?authSource=admin", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => console.log("Connecté à la BDD")
);

const routes = require("./routes/api/routes");
const index = require('./routes/index');
const signinRoute = require('./routes/signin');
const signupRoute = require('./routes/signup');
const settingsRoute = require('./routes/settings');
const ytbRoute = require('./routes/ytb');
const gameRoute = require('./routes/game');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "ThreeSelectif",
    resave: "false",
    saveUninitialised: true,
}));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', routes);
app.use('/signin', signinRoute);
app.use('/signup', signupRoute);
app.use('/game', gameRoute);
app.use('/settings', settingsRoute);
app.use('/ytb', ytbRoute);

app.use(function(req, res,next){
    let err = new Error('Not found');
    err.status = 404;
    next(err);
});

http.listen(1234, function(){
    console.log('Le serveur WEB vient de démarrer.')
});
