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

// Ajouter un commentaire à une tâche
router.post('/:id_tasks', verifyToken, (req, res) => {
    const { id_tasks } = req.params;
    const { comment_text } = req.body;

    const sql = 'INSERT INTO comments (id_tasks, id_user, comment_text) VALUES (?, ?, ?)';
    const values = [id_tasks, req.userId, comment_text];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Commentaire ajouté avec succès', commentId: result.insertId });
    });
});

// Lister les commentaires d'une tâche
router.get('/:id_tasks', verifyToken, (req, res) => {
    const { id_tasks } = req.params;

    const sql = 'SELECT * FROM comments WHERE id_tasks = ?';
    
    db.query(sql, [id_tasks], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Modifier un commentaire
router.put('/:id_comment', verifyToken, (req, res) => {
    const { id_comment } = req.params;
    const { comment_text } = req.body;

    const sql = 'UPDATE comments SET comment_text = ? WHERE id_comment = ? AND id_user = ?';
    const values = [comment_text, id_comment, req.userId];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Commentaire non trouvé ou non autorisé' });
        res.status(200).json({ message: 'Commentaire mis à jour avec succès' });
    });
});

// Supprimer un commentaire
router.delete('/:id_comment', verifyToken, (req, res) => {
    const { id_comment } = req.params;

    const sql = 'DELETE FROM comments WHERE id_comment = ? AND id_user = ?';

    db.query(sql, [id_comment, req.userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Commentaire non trouvé ou non autorisé' });
        res.status(200).json({ message: 'Commentaire supprimé avec succès' });
    });
});

module.exports = router;