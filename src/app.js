const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');

const passport = require('passport');                       //PASSPORT
const LocalStrategy = require('passport-local').Strategy;   //PASSPORT

const MySQLStore = require ('express-mysql-session')(session);                  //AGREGADO
const db = require('./services/database');                  //AGREGADO


const sessionStore = new (MySQLStore)({
    clearExpired: true,
    expiration: 86400000,                  //AGREGADO
    checkExpirationInterval: 3600000,
    createDatabaseTable: true,
}, db);


app.use(session({
    secret: 'TuSecretKey', // Cambia esto a una cadena secreta más segura
    resave: false,
    saveUninitialized: false,
  }));

// Configuración de express-flash
app.use(flash());


//PRUEBA PASSPORT

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await db.query('SELECT * FROM users WHERE email = ? AND password = SHA(?)', [email, password]);

      if (!user || user.length === 0) {
        return done(null, false, { message: 'Correo o contraseña incorrectos' });
      }

      return done(null, user[0]);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id_user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.query('SELECT * FROM users WHERE id_user = ?', [id]);

    if (!user || user.length === 0) {
      return done(null, false);
    }

    return done(null, user[0]);
  } catch (error) {
    return done(error);
  }
});

//PRUEBA PASSPORT


//Aqui se supone va el app de express
app.use(express.static('./'));
app.use(session({
    secret: 'Tourify',
    resave: false,                  //AGREGADO
    saveUninitialized: false,
    store: sessionStore
}));

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