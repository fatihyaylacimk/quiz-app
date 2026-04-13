// REGISTER
async function register() {
    const user = userVal();
    const pass = passVal();

    await fetch("/register", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({username:user,password:pass})
    });

    alert("Registered");
}

// LOGIN
async function login() {
    const user = userVal();
    const pass = passVal();

    const res = await fetch("/login", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({username:user,password:pass})
    });

    const data = await res.json();

    if(data.success){
        username = user;
        document.getElementById("quiz").style.display = "block";
        generateQuestions();
        loadLeaderboard();
    } else {
        alert("Login failed");
    }
}

// FINISH
async function finish(){
    document.getElementById("score").innerText=`Score: ${score} | XP: ${xp}`;
    document.getElementById("rank").innerText=`Rank: ${getRank(xp)}`;

    await fetch("/score",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name:username,score:xp})
    });

    loadLeaderboard();
}

// LEADERBOARD
async function loadLeaderboard(){
    const res=await fetch("/scores");
    let data=await res.json();

    data=data.slice(0,5);

    const ul=document.getElementById("leaderboard");
    ul.innerHTML="";

    data.map((p,i)=>{
        const li=document.createElement("li");
        li.innerText=`${i+1}. ${p.name} - ${p.score}`;
        ul.appendChild(li);
    });

    drawChart(data);
}
