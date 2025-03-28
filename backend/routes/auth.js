const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");
const redis = require("redis");
const router = express.Router();

const redisClient = redis.createClient();
redisClient.on("error", (err) => {
  console.error("Erreur Redis:", err);
});

// connect to redis
redisClient.connect().catch(console.error);

router.post("/register", async (req, res) => {
  try {
    const { prenom, nom, email, motdepasse } = req.body;  
    if (!prenom || !nom || !email || !motdepasse) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    const hashedPassword = await bcrypt.hash(motdepasse, 10);
    const query = "INSERT INTO utilisateurs (prenom, nom, email, motdepasse) VALUES (?, ?, ?, ?)";
    
    db.query(query, [prenom, nom, email, hashedPassword], (err) => {
      if (err) {
        console.error("Erreur de base de données:", err); 
        return res.status(500).json({ error: "Erreur lors de l'inscription de l'utilisateur", details: err });
      }
      res.status(201).json({ message: "Utilisateur inscrit avec succès!" });
    });

  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

async function verifierConnexion(email) {
  return new Promise((resolve, reject) => {
    const key = `connexions:${email}`;

    redisClient.get(key, (err, connexions) => {
      if (err) reject(err);
      // Crée la clé avec expiration de 10 minutes et bloque la connexion en cas de trop de tentatives
      if (!connexions) {
        redisClient.setex(key, 600, 1); 
        resolve(true);
      } else if (parseInt(connexions) < 10) {
        redisClient.incr(key); 
        resolve(true);
      } else {
        resolve(false); 
      }
    });
  });
}

router.post("/login", async (req, res) => {
  console.log("Tentative de connexion reçue", req.body);
  const { email, motdepasse } = req.body;

  if (!(await verifierConnexion(email))) {
    return res.status(429).json({ error: "Trop de tentatives, réessayez dans 10 minutes." });
  }

  const query = "SELECT * FROM utilisateurs WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur du serveur" });
    if (results.length === 0) return res.status(401).json({ error: "Utilisateur non trouvé" });

    const utilisateur = results[0];
    const motDePasseCorrect = await bcrypt.compare(motdepasse, utilisateur.motdepasse);
    
    if (!motDePasseCorrect) return res.status(401).json({ error: "Mot de passe incorrect" });

    //token JWT
    const token = jwt.sign({ id: utilisateur.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  });
});

module.exports = router;
