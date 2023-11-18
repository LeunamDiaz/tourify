const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');

app.use(express.static('./'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'Tourify',
    resave: false,
    saveUninitialized: true
}));

app.use(require('./routes/index'));

const port = 3000;
app.listen(port, () => {
    console.log('Ejecutando en el puerto: ', port);
});