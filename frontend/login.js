document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    // Retirer les espaces superflus
    const email = document.getElementById('email').value.trim();
    const motdepasse = document.getElementById('motDePasse').value.trim();
  
    if (!email || !motdepasse) {
      document.getElementById('error-message').textContent = "Tous les champs sont obligatoires!";
      return;
    }
  
    try {
      // Envoie la requête de connexion au backend
      const response = await fetch('/auth/login', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motdepasse }) 
      });
  
      // Reçoit la réponse du serveur
      const data = await response.json();
      
      if (!response.ok) {
        document.getElementById('error-message').textContent = data.error || "Une erreur est survenue!";
      } else {
        // Si la connexion est réussie, affiche une alerte et stocke le token dans le localStorage
        alert("Connexion réussie !");
        localStorage.setItem("token", data.token);  
        window.location.href = "dashboard.html"; 
      }
    } catch (error) {
      document.getElementById('error-message').textContent = "Erreur de connexion au serveur!";
    }
});
