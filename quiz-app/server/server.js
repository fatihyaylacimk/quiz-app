const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// 🔥 TEST API
app.get("/api", (req, res) => {
    res.json({ message: "API çalışıyor" });
});

// 🔥 REGISTER
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ message: "Boş bırakma" });
    }

    res.json({ message: "Kayıt başarılı ✅" });
});

// 🔥 LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "123") {
        res.json({ message: "Giriş başarılı 🎉" });
    } else {
        res.json({ message: "Hatalı giriş ❌" });
    }
});

// 🔥 FRONTEND SERVE
app.use(express.static(path.join(__dirname, "../client")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

// 🔥 PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
