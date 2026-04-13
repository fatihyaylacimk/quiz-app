const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// IN-MEMORY DATA
let users = [];
let scores = [];

// REGISTER
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.json({ success: false, message: "User exists" });
    }
    users.push({ username, password });
    res.json({ success: true });
});

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.json({ success: false });
    res.json({ success: true });
});

// SAVE SCORE (XP bazlı)
app.post("/score", (req, res) => {
    const { name, score } = req.body;
    scores.push({ name, score });
    res.json({ success: true });
});

// GET SCORES (desc)
app.get("/scores", (req, res) => {
    res.json(scores.sort((a, b) => b.score - a.score));
});

app.listen(5000, () => console.log("Server running on port 5000"));