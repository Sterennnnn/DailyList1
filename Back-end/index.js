const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const taskRoutes = require('./routes/comments');
const taskRoutes = require('./routes/notifications');
require('dotenv').config();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Routes
app.use('/users', userRoutes);  // Route pour la gestion des utilisateurs
app.use('/tasks', taskRoutes);  // Route pour la gestion des tâches
app.use('/comments', CommentRoutes);  // Route pour la gestion des commentaires
app.use('/notifications', NotificationRoutes);  // Route pour la gestion des notifications

// Route de base
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API de DailyList');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`L'API fonctionne sur le port ${port}`);
});