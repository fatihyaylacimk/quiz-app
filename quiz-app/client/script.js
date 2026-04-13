function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${window.location.origin}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);

        if (data.message.includes("başarılı")) {
            // 🔥 BURASI ÖNEMLİ
            startGame();  
        }
    });
}
