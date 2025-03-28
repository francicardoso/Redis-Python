const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { prenom, nom, email, senha } = req.body;  // Ajuste para receber prenom e nom
    if (!prenom || !nom || !email || !senha) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const query = "INSERT INTO utilisateurs (prenom, nom, email, senha) VALUES (?, ?, ?, ?)";
    
    db.query(query, [prenom, nom, email, hashedPassword], (err) => {
      if (err) {
        console.error("Database error:", err); // Adicionando log detalhado para o erro
        return res.status(500).json({ error: "Erreur lors de l'inscription de l'utilisateur", details: err });
      }
      res.status(201).json({ message: "Utilisateur inscrit avec succès!" });
    });

  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});


router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  // Vérifier l'utilisateur dans la base de données
  const query = "SELECT * FROM utilisateurs WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur du serveur" });
    if (results.length === 0) return res.status(401).json({ error: "Utilisateur non trouvé" });

    const utilisateur = results[0];

    // Vérifier le mot de passe
    const motDePasseCorrect = await bcrypt.compare(senha, utilisateur.senha);
    if (!motDePasseCorrect) return res.status(401).json({ error: "Mot de passe incorrect" });

    // Générer le jeton JWT
    const token = jwt.sign({ id: utilisateur.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  });
});

module.exports = router;
