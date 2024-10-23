const mysql = require('mysql2');
require('dotenv').config();

// Création de la connexion à la base de données
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connecte à la base de données
connection.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connexion réussie à la base de données MySQL');
});

module.exports = connection;