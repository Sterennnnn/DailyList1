// Gérer l'affichage du panneau d'avatars
document.getElementById('chooseAvatarBtn').addEventListener('click', function() {
    const avatarPanel = document.getElementById('avatarPanel');
    avatarPanel.style.display = avatarPanel.style.display === 'block' ? 'none' : 'block';
});

// Gérer la sélection d'un avatar
const avatars = document.querySelectorAll('.avatar-option');
avatars.forEach(avatar => {
    avatar.addEventListener('click', function() {
        const selectedAvatar = document.getElementById('selectedAvatar');
        selectedAvatar.src = this.src;

        // Stocker la sélection dans l'input caché
        document.getElementById('chosenAvatar').value = this.src;

        // Cacher le panneau après la sélection
        document.getElementById('avatarPanel').style.display = 'none';
    });
});

// Soumission du formulaire d'inscription
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    // Récupérer les données du formulaire
    const formData = new FormData(this); // Utilise FormData pour gérer les données du formulaire

    // Envoyer une requête POST au serveur
    fetch('http://127.0.0.1:5500/users/register', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Inscription réussie !');
            // Rediriger vers la page de connexion ou autre
            window.location.href = 'login.html';
        } else {
            alert('Erreur : ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
    });
});
