const { Router } = require('express');
const router = Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const { promisify }= require('util'); //AGREGADO
const { log } = require('console');
const { text } = require('body-parser');

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

db.query = promisify(db.query); //AGREGADO

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

router.get('/historicals', (req, res) => {
    res.render('historicals.ejs');
});


router.get('/events', async(req, res) => {

    try {
        const events = await db.query('select * from events');  //Obtener eventos
        const fechasLegibles = events.map(event => {
            const fecha = new Date(event.dateend).toLocaleString();
            console.log(fecha);
            return fecha;
        });

        const img = await db.query('select name, image from users where id_user = 8');  //Obtener imagen del usuario
        res.render('events.ejs', {events: events, img: img, fechasLegibles: fechasLegibles});  //Renderizar la pagina con los datos
    } catch (error) {
        throw error;
        
    }
    
});

router.get('/homeu', async(req, res) => {
    const img = await db.query('select name, image from users where id_user = 8'); //Obtener imagen del usuario
    res.render('index.ejs', {img: img});
});

router.get('/map', async(req, res) => {
    const img = await db.query('select image from users where id_user = 8'); //Obtener imagen del usuario
    res.render('map.ejs', {img: img})
});


//MODELO 3D
router.get('/model', (req, res) => {
    res.render('model.ejs')
});

router.get('/model2', (req, res) => {
    res.render('model2.ejs');
});

//AGREGADO-------------------------------------------

router.get('/profile', async(req, res) => {
    const user8 = await db.query('SELECT name, email, (SELECT name FROM countries WHERE id_country = (SELECT country FROM users WHERE id_user = 8)) as country FROM users where id_user = 8');
    console.log(user8);  //BORRABLE
    const img = await db.query('select name, image from users where id_user = 8'); //Obtener imagen del usuario
    res.render('profile.ejs',{user: user8, img: img})
});


router.get('/editprofile', async (req, res) => {
    const user8 = await db.query('SELECT name, email, (SELECT name FROM countries WHERE id_country = (SELECT country FROM users WHERE id_user = 8)) as country, password FROM users where id_user = 8');
    const img = await db.query('select image from users where id_user = 8'); //Obtener imagen del usuario
    const countriesList = await db.query('SELECT id_country, name FROM countries'); // Obtener la lista de países
    countriesList.sort((a, b) => a.name.localeCompare(b.name));   //Acomoda los paises en orden alfabetico
  
    res.render('editprofile.ejs', {
      user: user8,                  //Pasa todos los valores de la query del usuario en este caso igual a 8
      countriesList: countriesList, // Pasar la lista de países a la vista
      img:img //Pasar imagen del usuario
    });
  });

  router.post('/editprofile', async (req, res) => {
    const { name, email, country, password } = req.body;
    const newUser = {
        name,
        email,
        country,
        password
    };
    await db.query('UPDATE users SET name = ?, email = ?, country = ?, password = ? where id_user = 8', [newUser.name, newUser.email, newUser.country, newUser.password]);
    res.redirect('/profile');
});
//------------------------------------------------------



//AGREGADO SEGUNDA PARTE PARA LO DE LOS LOGROS
//FUNCIONA PERO SIN IMAGEN
/* router.get('/achievements', (req,res) => {
    db.query('select * from achievements',(error, results) => {
        if(error){
            throw error;
        }else{
            
            res.render('achievements.ejs', {results: results});
        }
            
    }); 
}); */

//PRUEBA CON IMAGEN
router.get('/achievements', async (req,res) => {
    try {
        const results = await db.query('select * from achievements');
        console.log(results);
        const img = await db.query('select name, image from users where id_user = 8');
        res.render('achievements.ejs', {results: results, img: img});
    } catch (error) {
        throw error;
        
    }
});


router.get('/admin', async(req, res) => {
    const img = await db.query('select image from users where id_user = 8');
    res.render('admin.ejs', {img:img})
});

router.post('/register', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const email = req.body.email;

    // Inicializar variables de estado
    let emailRegistrado = false;
    let contraseñaNoCoincide = false;
    let errorInterno = false;
    let successMessage = false;

    // Verificar si las contraseñas coinciden
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