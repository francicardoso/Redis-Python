document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    // Supprime les espaces supplémentaires
    const prenom = document.getElementById('prenom').value.trim();
    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();
    const motdepasse = document.getElementById('motDePasse').value.trim();
  
    // Vérifier les valeurs des champs avant la validation
    console.log('prenom:', prenom);
    console.log('nom:', nom);
    console.log('email:', email);
    console.log('motdepasse:', motdepasse);
  
    if (!prenom || !nom || !email || !motdepasse) {
      document.getElementById('error-message').textContent = "Tous les champs sont obligatoires!";
      return;
    }
  
    try {
      // Envoie des données au serveur
      const response = await fetch('/auth/register', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, nom, email, motdepasse })
      });
  
      // Vérifier si la réponse est réussie
      if (!response.ok) {
        const data = await response.json();
        document.getElementById('error-message').textContent = data.error || "Une erreur est survenue!";
      } else {
        const data = await response.json();
        alert(data.message);  
        document.getElementById('registerForm').reset();
      }
    } catch (error) {
      document.getElementById('error-message').textContent = "Erreur de connexion au serveur!";
    }
});
