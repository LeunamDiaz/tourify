const { Router } = require('express');
const router = Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tourify'
});

db.connect((err) => {
    if (err) {
        console.log('No se ha podido establecer contacto con la base de datos.');
    } else {
        console.log('La conección a la base de datos, se ejecutó con normalidad.');
    }
});

process.on(`SIGINT`, () => {
    db.end((err) => {
        if (err) {
            console.error('No se ha podido desconectar de la base de datos actual.' + err.message);
        } else {
            console.log('Se ha desconectado correctamente de la base de datos actual.');
        }
        process.exit();
    });
});

router.get('/', (req, res) => {
    res.render('login.ejs');
});

router.get('/register', (req, res) => {
    res.render('register.ejs');
});

router.get('/homeu', (req, res) => {
    res.render('index.ejs');
});

router.get('/map', (req, res) => {
    res.render('map.ejs')
});

router.get('/achievements', (req, res) => {
    res.render('achievements.ejs')
});

router.get('/profile', (req, res) => {
    res.render('profile.ejs')
});

router.get('/admin', (req, res) => {
    res.render('admin.ejs')
});

router.post('/register', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const registerSQL = 'INSERT INTO users(name, email, password) VALUES (?,?,?)';
    const valores = [name, email, password];
    db.query(registerSQL, valores, (error, resultado) => {
        if(error){
            console.error('No se pudo insertar el dato'+error.message);
        }
        console.log('Datos insertados correctamente');
        res.redirect('/');
    });
});

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const loginSQL = 'SELECT * FROM users WHERE email = ? AND password = ?'
    const valores = [email, password];
    db.query(loginSQL, valores, (error, resultado) => {
        if (error) {
            console.error('Error al consultar la base de datos:', error.message);
            // Manejar el error apropiadamente
            res.status(500).json({ error: 'Error de servidor' });
        } else {
            if (resultado.length === 0) {
                // Las credenciales no coinciden
                console.error('Credenciales incorrectas');
                res.render('login.ejs', { credencialesIncorrectas: true });
                /* Esta es la condicional para el error de credenciales, su implementacion es igual para todos los errores que requieran alerta, solo es cambiar la variable y el if dentr del archivo ejs que quieras introducir el alert */
            } else {
                // Credenciales válidas, el usuario ha iniciado sesión correctamente
                console.log('Inicio de sesión exitoso');
                res.redirect('/homeu');
            }
        }
    });
});

module.exports = router;