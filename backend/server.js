require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const redis = require("redis");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

devNull.connect(err => {
    if(err) {
        console.error("Error to conect to MySQL:", err);
    } else {
        console.log("Connected to MySQL");
    }
});



// Connect to Redis

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

redisClient.connect().then(() => console.log("Connected to Redis"));

// test route
app.get("/", (req, res) => {
  res.send("Servidor Node.js rodando!");
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000 🚀");
});
