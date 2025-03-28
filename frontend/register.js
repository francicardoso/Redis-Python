document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    // Pega os valores dos campos e remove espaços extras
    const prenom = document.getElementById('prenom').value.trim();
    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();
    const motdepasse = document.getElementById('motDePasse').value.trim();
  
    // Verifique os valores dos campos antes da validação
    console.log('prenom:', prenom);
    console.log('nom:', nom);
    console.log('email:', email);
    console.log('motdepasse:', motdepasse);
  
    // Verifica se todos os campos estão preenchidos e se não há apenas espaços em branco
    if (!prenom || !nom || !email || !motdepasse) {
      document.getElementById('error-message').textContent = "Tous les champs sont obligatoires!";
      return;
    }
  
    try {
      // Envia os dados para o servidor
      const response = await fetch('/auth/register', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, nom, email, motdepasse })
      });
  
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        // Se não foi ok, pega o erro retornado
        const data = await response.json();
        document.getElementById('error-message').textContent = data.error || "Une erreur est survenue!";
      } else {
        // Caso o cadastro tenha sido bem-sucedido
        const data = await response.json();
        alert(data.message);  // Mensagem de sucesso
        // Limpa o formulário ou redireciona o usuário, por exemplo
        document.getElementById('registerForm').reset();
      }
    } catch (error) {
      // Se houver erro de rede ou outro erro de servidor
      document.getElementById('error-message').textContent = "Erreur de connexion au serveur!";
    }
  });
  