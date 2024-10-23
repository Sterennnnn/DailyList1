async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:3000/api/tasks'); // Remplacez par l'URL appropriée
        const tasks = await response.json();

        const taskTableBody = document.querySelector('.task-board tbody');
        taskTableBody.innerHTML = ''; // Vider le tableau avant d'ajouter les tâches

        tasks.forEach(task => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${task.title}</td>
                <td>${task.responsable ? task.responsable : 'Non assigné'}</td>
                <td><span class="status ${task.status.toLowerCase()}">${task.status}</span></td>
                <td>${task.date_limite ? task.date_limite : 'À définir'}</td>
            `;
            taskTableBody.appendChild(newRow);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
    }
}

// Fonction pour récupérer les notifications depuis l'API
async function fetchNotifications() {
    try {
        const response = await fetch('http://localhost:3000/api/notifications'); // Remplacez par l'URL appropriée
        const notifications = await response.json();

        const notificationsContainer = document.querySelector('.notifications');
        notificationsContainer.innerHTML = ''; // Vider les notifications avant d'ajouter

        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.classList.add('notification-item');
            notificationItem.textContent = notification.notification_text;
            notificationsContainer.appendChild(notificationItem);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
    }
}

// Fonction pour initialiser les données à la chargement de la page
function initialize() {
    fetchTasks();
    fetchNotifications();
}

// Appel de la fonction d'initialisation lorsque la page est chargée
document.addEventListener('DOMContentLoaded', initialize);