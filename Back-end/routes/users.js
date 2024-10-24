const mysql = require('mysql'); // Import du module MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Remplace par ton mot de passe MySQL
    database: 'dailylist'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
    } else {
        console.log('Connecté à la base de données');
    }
});

const cors = require('cors');
app.use(cors());

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000;
require('dotenv').config();

// Inscription d'un utilisateur
router.post('/register', (req, res) => {
    console.log(req.body);
    const { username, email, password, avatar } = req.body;

    // Vérification si l'utilisateur existe déjà
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ error: 'Utilisateur déjà existant' });

        // Hash du mot de passe
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ error: err.message });

            // Insertion du nouvel utilisateur dans la base de données
            db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hash], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'Utilisateur créé avec succès' });
            });
        });
    });
});

// Connexion de l'utilisateur (Login)
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Vérification des informations de connexion
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ error: 'Utilisateur non trouvé' });

        const user = results[0];

        // Comparaison du mot de passe
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!isMatch) return res.status(400).json({ error: 'Mot de passe incorrect' });

            // Création d'un token JWT
            const token = jwt.sign({ id_user: user.id_user }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'Connexion réussie', token });
        });
    });
});

module.exports = router;

// Démarrer le serveur
app.listen(port, () => {
    console.log(`L'API fonctionne sur le port ${port}`);
});