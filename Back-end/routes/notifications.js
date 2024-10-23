const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware pour vérifier l'authentification
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'Token requis' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token invalide' });
        req.userId = decoded.id_user;
        next();
    });
};

// Lister toutes les notifications pour l'utilisateur connecté
router.get('/', verifyToken, (req, res) => {
    const sql = 'SELECT * FROM notifications WHERE id_user = ?';

    db.query(sql, [req.userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Marquer une notification comme lue
router.put('/:id_notification', verifyToken, (req, res) => {
    const { id_notification } = req.params;

    const sql = 'UPDATE notifications SET status_read = TRUE WHERE id_notification = ? AND id_user = ?';
    
    db.query(sql, [id_notification, req.userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Notification non trouvée ou non autorisée' });
        res.status(200).json({ message: 'Notification marquée comme lue' });
    });
});

module.exports = router;