const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');

// Middlewares
app.use(express.json());  

// Routes
app.use("/auth", authRoutes); 

// Configuration du port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
