const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Geçici kullanıcı listesi (RAM)
let users = [];

// REGISTER
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    const userExists = users.find(u => u.username === username);

    if (userExists) {
        return res.json({ message: "Kullanıcı zaten var ❌" });
    }

    users.push({ username, password });

    res.json({ message: "Kayıt başarılı ✅" });
});

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (user) {
        res.json({ message: "Giriş başarılı ✅" });
    } else {
        res.json({ message: "Hatalı giriş ❌" });
    }
});

// CLIENT SERVE
app.use(express.static(path.join(__dirname, "../client")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
