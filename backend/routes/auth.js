const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

const router = express.Router();

// Rota de registro
router.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  // Criptografar a senha
  const hashedPassword = await bcrypt.hash(senha, 10);

  // Salvar no banco
  const query = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
  db.query(query, [nome, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro no servidor" });
    res.status(201).json({ message: "Usuário registrado!" });
  });
});

// Rota de login
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  // Verificar usuário no banco
  const query = "SELECT * FROM usuarios WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor" });
    if (results.length === 0) return res.status(401).json({ error: "Usuário não encontrado" });

    const usuario = results[0];

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ error: "Senha incorreta" });

    // Gerar o token JWT
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  });
});

module.exports = router;
