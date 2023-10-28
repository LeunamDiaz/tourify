const { Router } = require('express');
const router = Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');

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

router.post('/home', (req, res) => {
    const email = req.body.email;
    const enteredPassword = req.body.password;

    const loginSQL = 'SELECT * FROM users WHERE email = ?';
    db.query(loginSQL, [email], (error, results) => {
        if (error) {
            console.error('Error al consultar la base de datos:', error.message);
            res.status(500).json({ error: 'Error de servidor' });
        } else {
            if (results.length === 0) {
                // Usuario no encontrado
                res.send('Datos incorrectos.');
            } else {
                // Usuario encontrado, continúa con el flujo de la aplicación
                const storedPasswordHash = results[0].password;
                bcrypt.compare(enteredPassword, storedPasswordHash, (error, passwordMatch) => {
                    if (error) {
                        console.error('Error al comparar contraseñas:', error);
                        res.status(500).json({ error: 'Error de servidor' });
                    } else if (passwordMatch) {
                        // Contraseña coincidente, el usuario está autenticado con éxito
                        res.render('index.ejs');
                    } else {
                        // Contraseña incorrecta
                        console.log('Contraseña incorrecta')
                        res.send('Datos incorrectos.');
                    }
                });
            } 
        }
    });
});

router.get('/register', (req, res) => {
    res.render('register.ejs');
});

router.post('/register', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;

    // Genera un hash de la contraseña
    bcrypt.hash(password, 10, (error, hashedPassword) => {
        if (error) {
            console.error('Error al generar el hash de la contraseña:', error);
            res.status(500).json({ error: 'Error de servidor' });
        } else {
            const registerSQL = 'INSERT INTO users(name, email, password) VALUES (?,?,?)';
            const valores = [name, email, hashedPassword]; // Almacena el hash en lugar de la contraseña en texto claro
            db.query(registerSQL, valores, (error, resultado) => {
                if (error) {
                    console.error('No se pudo insertar el dato', error.message);
                    res.status(500).json({ error: 'Error de servidor' });
                } else {
                    console.log('Datos insertados correctamente');
                    res.sendFile('login.ejs');
                }
            });
        }
    });
});

router.get('/home', (req, res) => {
    res.render('index.ejs');
});

router.post('/register', (req, res) => {
    // ... El código para registrar usuarios
});

router.post('/home', (req, res) => {
    // ... El código para el inicio de sesión
});

module.exports = router;