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

// Créer une nouvelle tâche
router.post('/', verifyToken, (req, res) => {
    const { title, description, priority, date_limite, responsable, status } = req.body;

    const sql = 'INSERT INTO tasks (title, description, priority, date_limite, responsable, status) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [title, description, priority, date_limite, responsable, status];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Tâche créée avec succès', taskId: result.insertId });
    });
});

// Lister toutes les tâches
router.get('/', verifyToken, (req, res) => {
    const sql = 'SELECT * FROM tasks';

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Modifier une tâche par ID
router.put('/:id_tasks', verifyToken, (req, res) => {
    const { title, description, priority, date_limite, responsable, status } = req.body;
    const { id_tasks } = req.params;

    const sql = 'UPDATE tasks SET title = ?, description = ?, priority = ?, date_limite = ?, responsable = ?, status = ? WHERE id_tasks = ?';
    const values = [title, description, priority, date_limite, responsable, status, id_tasks];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Tâche non trouvée' });
        res.status(200).json({ message: 'Tâche mise à jour avec succès' });
    });
});

// Supprimer une tâche par ID
router.delete('/:id_tasks', verifyToken, (req, res) => {
    const { id_tasks } = req.params;

    const sql = 'DELETE FROM tasks WHERE id_tasks = ?';

    db.query(sql, [id_tasks], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Tâche non trouvée' });
        res.status(200).json({ message: 'Tâche supprimée avec succès' });
    });
});

module.exports = router;