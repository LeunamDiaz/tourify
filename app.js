const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('./'))

app.use('/images', express.static('./images'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html')
});

const port = 3000;
app.listen(port,() => {
    console.log('Ejecutando en el puerto: ', port)
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs-login'
})

db.connect((err)=>{
    if(err){
        console.log('No se ha podido establecer contacto con la base de datos.');
    }
    else{
        console.log('La conección a la base de datos, se ejecuto con normalidad.');
    }
});

process.on(`SIGINT`, ()=>{
    db.end((err)=>{
        if(err){
            console.error('No se ha podido desconectar de la base de datos actual.' + err.message);
        }
        else{
            console.log('Se ha desconectado correctamente de la base de datos actual.');
        }
        process.exit();
    });
});

app.get('/home', (req,res) => {
    res.sendFile(__dirname + '/login.html')
})

app.get('/regis', (req, res) => {
    res.sendFile(__dirname + '/register.html')
});

app.get('/user/data', (req, res) => {
    const nameUser = "SELECT * FROM users";
    db.query(nameUser, (error, resultado) => {
        if(error){
            console.error("Error " + err.message);
            return res.status(500).send("Error al consultar los datos");
        }
        res.json(resultado);
    });
});

app.get('/user', (req, res) => {
    res.sendFile(__dirname + '/user.html');
});

app.get('/loginf', (req, res) => {
    res.sendFile(__dirname + '/loginfail.html')
})

app.post('/register', (req, res) => {
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
                    res.sendFile(__dirname + '/login.html');
                }
            });
        }
    });
});

app.post('/home', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const loginSQL = 'SELECT * FROM users WHERE email = ? and password = ?';
    const valores = [email, password];
    db.query(loginSQL, valores, (error, results) => {
        if (error) {
            console.error('Error al consultar la base de datos:', error.message);
            res.status(500).json({ error: 'Error de servidor' });
        } else {
            if (results.length === 0) {
                // Usuario no encontrado
                res.sendFile(__dirname + '/loginfail.html');
            } else {
                // Usuario encontrado, continúa con el flujo de la aplicación
                res.sendFile(__dirname + '/index.html');
            }
        }
    });
});