const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// 🔹 Örnek API (test için)
app.get("/api", (req, res) => {
  res.json({ message: "API çalışıyor 🚀" });
});

// 🔹 CLIENT (frontend) serve et
app.use(express.static(path.join(__dirname, "../client")));

// 🔹 tüm route'ları index.html'e yönlendir
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// 🔹 PORT AYARI (Render için zorunlu)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
