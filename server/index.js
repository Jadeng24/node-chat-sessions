const express = require('express');
const bodyParser = require('body-parser');
const mc = require(`${__dirname}/controllers/messages_controller`);
const session = require('express-session');
const createInitialSession = require('./middlewares/session.js');
const filter = require('./middlewares/filter.js');
const app = express();

app.use(session({
    secret: "b8vh24cnu9d89m9e3u2rfh98adf7543bv", //random secret thing
    resave: false, //should it save/overwrite cook/contact
    saveUninitialized: false, // add a cookie even if node doesnt say so
    cookie: { maxAge: 10000 } // age of cookie until goes bad (expires)
    
}))
app.use(createInitialSession);

app.use(bodyParser.json());

app.use(function (req, res, next) {
    if (req.method === "POST" || req.method === "PUT") {
        filter(req, res, next);
    } else {
        next();
    }

})
app.use(express.static(`${__dirname}/../public/build`));

const messagesBaseUrl = "/api/messages";
app.post(messagesBaseUrl, mc.create);
app.get(messagesBaseUrl, mc.read);
app.get(messagesBaseUrl + '/history', mc.history);
app.put(`${messagesBaseUrl}`, mc.update);
app.delete(`${messagesBaseUrl}`, mc.delete);

const port = 3000;
app.listen(port, () => { console.log(`Server listening on port ${port}.`); });