const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('./'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('./routes/index'));

const port = 3000;
app.listen(port, () => {
    console.log('Ejecutando en el puerto: ', port);
});