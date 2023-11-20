const { Router } = require('express');
const router = Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'static/imageshistoricals'); // Ruta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({ storage: storage });

const { promisify }= require('util'); //AGREGADO
const { log } = require('console');
const { text } = require('body-parser');
const { Select } = require('flowbite-react');

  //BASE DE DATOS

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

  //DECLARACION PROMESAS

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


    //COMIENZAN RUTAS DE LAS PAGINAS DEL INTEGRADOR



        //TODO DEL LOGIN (GET Y POST)

router.get('/', (req, res) => {     //Funcion para renderizar la primera pagina de Tourify para que el usuario se logee (get)
  res.render('login.ejs');
});

router.post('/login', (req, res) => {   //Funcion para verificar el login del usuario (post)
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

  //AQUI TERMINA TODO LO DEL LOGIN



          //TODO DEL REGISTER (GET Y POST)


router.get('/register', (req, res) => {   //Funcion que renderiza la pagina de register (get)
    res.render('register.ejs');
});

router.post('/register', (req, res) => {    //Funcion que ejecuta el registro del usuario (post)
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

  //AQUI TERMINA TODO LO DEL REGISTER



          //TODO DEL HOMEU (GET)

  router.get('/homeu', async(req, res) => {     //Pagina incial donde el usuario puede ver la pantalla inicial
    const img = await db.query('select name, image from users where id_user = 8'); //Obtener imagen del usuario
    res.render('index.ejs', {img: img});
  });  

  //AQUI TERMINA TODO LO DEL HOMEU



          //TODO DE lo del mapa (GET Y POST)


  router.get('/map', async(req, res) => {     //Renderiza pagina del mapa con las marcas correspondientes (get)
    
    try {
      const img = await db.query('select image from users where id_user = 8'); //Obtener imagen del usuario
      const events = await db.query('select * from events');
      const restaurants = await db.query('select id_food, name, coordinate, description, image FROM restaurants');
      const historicalplaces = await db.query('select id_historical, name, coordinate, pintype, image from historicals where pintype = 1');
      const museums = await db.query('select id_historical, name, coordinate, pintype, image from historicals where pintype = 2'); 
      const monuments = await db.query('select id_historical, name, coordinate, pintype, image from historicals where pintype = 3');
      const theaters = await db.query('select id_historical, name, coordinate, pintype, image from historicals where pintype = 4');
      const towns = await db.query('select id_historical, name, coordinate, pintype, image from historicals where pintype = 5');
      res.render('map.ejs', {img: img, events: events, restaurants: restaurants,historicalplaces:historicalplaces, museums: museums, monuments:monuments, theaters: theaters, towns:towns})
          
    } catch (error) {
      throw error;
    }
  });
  

  router.get('/historicals/:id_historical', async(req, res) => {
    const img = await db.query('select name, image from users where id_user = 8');
    
    const historical = await db.query('SELECT * FROM gethistorical WHERE id_historical = ?',[req.params.id_historical]);

    res.render('historicals.ejs', {img: img, historical: historical});
  });

 //AQUI TERMINA TODO LO DEL MAPA



          //TODO DE LOS EVENTS (GET) 

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

//AQUI TERMINA TODO LO DE EVENTS



          //TODO LO DE ACHIEVEMENTS (GET) 

router.get('/achievements', async (req,res) => {
  try {
      const results = await db.query('select * from achievements');
      const img = await db.query('select name, image from users where id_user = 8');


      const status = await db.query('SELECT id_historical, created_at FROM users_achievements where id_user = 8');
      console.log(status);


      res.render('achievements.ejs', {results: results, img: img, status: status});
  } catch (error) {
      throw error;
      
  }
});

//AQUI TERMINA TODO LO DE LOS ACHIEVEMENTS



          //TODO LO DE PROFILE (GET) 

  router.get('/profile', async(req, res) => {
    try {
        const userID = 8;
        const user8 = await db.query('SELECT name, email, (SELECT name FROM countries WHERE id_country = (SELECT country FROM users WHERE id_user = 8)) as country FROM users where id_user = 8');
        const img = await db.query('select name, image from users where id_user = 8'); //Obtener imagen del usuario

        const logros = await db.query('CALL getLogros(?, @logros)', [userID]);
        const resultado = await db.query('SELECT @logros as logros');


        res.render('profile.ejs',{user: user8, img: img, resultado:resultado})
    } catch (error) {
        throw error;
    }
  });

 //AQUI TERMINA TODO LO DE PROFILE
 
 

          //TODO LO DE EDITPROFILE (GET Y POST) 

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

  router.post('/editprofile', async (req, res) => {       //Esta parte nomas se alargo por culpa del bug de seleccionar el pais, fue dificil, pero se logró. :´)
      
    try {

      if (isNaN(parseInt(req.body.country, 10))) {
        const { name, email, password } = req.body;
        const newUser = {
            name,
            email,
            password
        };
        console.log(newUser);
        await db.query('UPDATE users SET name = ?, email = ?, password = ? where id_user = 8', [newUser.name, newUser.email, newUser.password]);
        res.redirect('/profile');

      } else {
        
        const { name, email, country, password } = req.body;
        const newUser = {
            name,
            email,
            country,
            password
        };
        console.log(newUser);
        await db.query('UPDATE users SET name = ?, email = ?, country = ?, password = ? where id_user = 8', [newUser.name, newUser.email, newUser.country, newUser.password]);
        res.redirect('/profile');

      }

    } catch (error) {
        throw error;
    }
    
  });

   //AQUI TERMINA TODO LO DE EDITPROFILE



          //TODO LO DEL ADMIN (GET Y POST) 

router.get('/admin', async(req, res) => {
    const img = await db.query('select image from users where id_user = 8');
    res.render('admin.ejs', {img:img})
});

// Ruta para manejar la carga de archivos
router.post('/uploadhistoricals',/*  upload.fields([{ name: 'image_place_historical', maxCount: 1 } , { name: 'model_3d', maxCount: 1 } ]), */ (req, res) => {
    
    const name = req.body.namehistorical;
    console.log(req.body.namehistorical);
    const coordinate = req.body.coordinate_historical;
    console.log(coordinate);
    const description = req.body.description_historical;
    console.log(description);
    const namecity = req.body.name_city_historical;
    console.log(namecity); 
    const year = req.body.year_construction;
    console.log(year);
    const urlvideo = req.body.video_historical;
    console.log(urlvideo);/* ,
    
      image: req.files['image_place_historical'].originalname *//* ,
      model: req.files['model_3d'][0].originalname */
    
  

    
    // Mover archivos a las carpetas correspondientes en el servidor
    /* const imageFileHistorical = req.files['image_place_historical'][0]; */
    /* const model3DFile = req.files['model_3d'][0]; */
  
    /* const imagePath = path.join(__dirname, 'static', 'imageshistoricals', imageFileHistorical.originalname); */
    /* const model3DPath = path.join(__dirname, 'static', 'assets', model3DFile.originalname); */
  
    /* imageFileHistorical.mv(imagePath, (err) => {
      if (err) {
        console.error('Error al mover la imagen:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        console.log('Imagen movida exitosamente:', imagePath);
      }
    }); */
  
    /* model3DFile.mv(model3DPath, (err) => {
      if (err) {
        console.error('Error al mover el modelo 3D:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        console.log('Modelo 3D movido exitosamente:', model3DPath);
      }
    }); */
  
    db.query('INSERT INTO historicals SET ?', {name:name, coordinate:coordinate, description:description, namecity:namecity, year:year, urlvideo:urlvideo}, (err, result) => {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      console.log('Datos históricos insertados en la base de datos:', historicalData);
      res.json({ message: 'Datos guardados con éxito.' });
    }
  });
});
  
  




  //PRUEBAS CON OTRAS PAGINAS QUE NO PERTENECERAN AL INTEGRADOR


//MAPA DE CHUY

router.get('/mapchuy', (req, res) => {
  res.render('mapchuy.ejs');
});

//MAPA DE PRUEBA

router.get('/mapprueba', (req, res) => {
  res.render('mapprueba.ejs');
});


//TERMINA COSAS DE MAPAS

//MODELO 3D
router.get('/model', (req, res) => {
  res.render('model.ejs')
});

router.get('/model2', (req, res) => {
  res.render('model2.ejs');
});

router.get('/model4', (req, res) => {
  res.render('model4.ejs');
});

//EL HISTORICAL DE PRUEBA QUE TIENE LA CATEDRAL



module.exports = router;   //LA COSA QUE EXPORTA A APP.JS