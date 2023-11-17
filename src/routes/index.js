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
    const confirmPassword = req.body.confirmPassword;
    const email = req.body.email;

    // Inicializar variables de estado *Agregue esto Dani
    let emailRegistrado = false;
    let contraseñaNoCoincide = false;
    let errorInterno = false;
    let successMessage = false;

    // Verificar si las contraseñas coinciden *Agregue esto Dani
    const passwordsMatch = (password === confirmPassword);

    if (!passwordsMatch) {
        contraseñaNoCoincide = true;
        console.log('Las contraseñas no coinciden');
        return res.render('register', { contraseñaNoCoincide });
    };

    // Verificar si el correo ya está registrado
    const checkEmailSQL = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailSQL, [email], (error, results) => {
        if (error) {
            errorInterno = true;
            console.log('Error en la consulta de correo: ' + error.message);
            res.render('register', { errorInterno });
        } else {
            if (results.length > 0) {
                emailRegistrado = true;
                console.log('Email ya registrado');
                res.render('register', { emailRegistrado });
            } else {
                // Intentar insertar un nuevo usuario
                const registerSQL = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';
                const valores = [name, email, password];
                db.query(registerSQL, valores, (error, resultado) => {
                    if (error) {
                        errorInterno = true;
                        console.log('Error al insertar usuario: ' + error.message);
                        res.render('register', { errorInterno });
                    } else {
                        successMessage = true;
                        res.render('login', { successMessage });
                    }
                });
            }
        }
    });
});

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    let errorEmail = false; 
    let errorPassword = false;
    let errorServidor = false;
    let datosVacios = false;
    //Agregue esto Dani
    if(!email || !password) {
        datosVacios = true;
        res.render('login', ({ datosVacios }))
    }
  
    // Verificar solo el email
    const checkEmailSQL = 'SELECT * FROM users WHERE email = ?';
  
    db.query(checkEmailSQL, [email], (error, results) => {
  
      if(!results || results.length === 0) {
        errorEmail = true;
        res.render('login', ({ errorEmail }));
      } else {
  
        // Verificar contraseña si el email existe
        const loginSQL = 'SELECT * FROM users WHERE email = ? AND password = ?';
        const valores = [email, password];
  
        db.query(loginSQL, valores, (error, resultado) => {
  
          if (error) {
            // Error del servidor
            errorServidor = true;
            res.render('login', ({ errorServidor }));
          } else if (resultado.length === 0) {
            // Contraseña incorrecta
            errorPassword = true; 
            res.render('login', ({ errorPassword }));
          } else {
            // Login correcto
            res.redirect('/homeu');
          }
        });
      }
    });
  });

module.exports = router;