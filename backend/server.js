const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const path = require('path');

// Middlewares
app.use(express.json());  
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use("/auth", authRoutes); 

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "register.html"));
  });
// Configuration du port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
app.get("/", (req, res) => {
    res.send("Serveur ok");
  });

  app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "login.html"));
});