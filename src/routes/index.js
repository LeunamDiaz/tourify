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

  let emailRegistrado = false;
  let errorInterno = false;
  let successMessage = false;

  // Verificar correo
  const checkEmailSQL = 'SELECT * FROM users WHERE email = ?';
  
  db.query(checkEmailSQL, [email], (error, results) => {
      if (results.length > 0) {
          emailRegistrado = true;
          console.log('Email ya registrado');
          // Renderizar vista con variables
          res.render('register', {
              emailRegistrado,
              errorInterno 
          });
      } else {
          // Intentar insertar 
          const registerSQL = 'INSERT INTO users(name, email, password) VALUES (?,?,?)';
          const valores = [name, email, password];
      
          db.query(registerSQL, valores, (error, resultado) => {
              if (error) {
                  errorInterno = true;
                  console.log('Error al insertar usuario: ' + error.message);
                  // Renderizar vista con variables
                  res.render('register', {
                      emailRegistrado,
                      errorInterno 
                  });
              } else {
                  // Redirigir a otra página si todo sale bien
                  
                  res.redirect('/login', ({ successMessage })); // Reemplaza '/otra_pagina' con la ruta real
              }
          });
      }
  });
});


// controlador
// Rutas login
router.post('/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
  
    let errorEmail = false; 
    let errorPassword = false;
    let errorServidor = false;
  
    // Verificar solo el email
    const checkEmailSQL = 'SELECT * FROM users WHERE email = ?';
  
    db.query(checkEmailSQL, [email], (error, results) => {
  
      if(!results || results.length === 0) {
        errorEmail = true;
        res.redirect('/', ({ errorEmail }));
      } else {
  
        // Verificar contraseña si el email existe
        const loginSQL = 'SELECT * FROM users WHERE email = ? AND password = ?';
        const valores = [email, password];
  
        db.query(loginSQL, valores, (error, resultado) => {
  
          if (error) {
            // Error del servidor
            errorServidor = true;
            res.redirect('/', ({ errorServidor }));
          } else if (resultado.length === 0) {
            // Contraseña incorrecta
            errorPassword = true; 
            res.redirect('/', ({ errorPassword }));
          } else {
            // Login correcto
            res.redirect('/homeu');
          }
        });
      }
    });
  });

module.exports = router;