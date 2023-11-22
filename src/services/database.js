const mysql = require('mysql');
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

module.exports = db;