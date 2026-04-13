let questions = [];
let current = 0;
let score = 0;
let xp = 0;
let username = "";
let difficulty = "easy";
let timerInterval;
let timeLeft = 10;
let chartInstance = null;

// DARK
function toggleDark() {
    document.body.classList.toggle("dark");
}

// MODE
function setDifficulty(mode) {
    difficulty = mode;
    alert("Mode: " + mode);
}

// REGISTER
async function register() {
    const user = userVal();
    const pass = passVal();

    await fetch("http://127.0.0.1:5000/register", {
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

    const res = await fetch("http://127.0.0.1:5000/login", {
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
    }
}

// HELPERS
function userVal(){return document.getElementById("user").value;}
function passVal(){return document.getElementById("pass").value;}
function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}

// GENERATE
function generateQuestions(){
    questions = [];

    for(let i=0;i<10;i++){
        let a,b,op;

        if(difficulty==="easy"){
            a=rand(1,20);
            b=rand(1,20);
            op=["+","-"][rand(0,1)];
        } else {
            a=rand(10,50);
            b=rand(1,10);
            op=["+","-","*","/"][rand(0,3)];
        }

        let correct;

        if(op==="+") correct=a+b;
        if(op===" -") correct=a-b;
        if(op==="*") correct=a*b;
        if(op==="/"){ correct=a; a=a*b; }

        const options = genOptions(correct);

        questions.push({
            question:`${a} ${op} ${b} = ?`,
            answers:options,
            correct:correct.toString()
        });
    }

    current=0; score=0; xp=0;
    show();
}

// OPTIONS
function genOptions(correct){
    let arr=[correct];
    while(arr.length<4){
        let f=correct+rand(-5,5);
        if(!arr.includes(f)) arr.push(f);
    }
    return arr.sort(()=>Math.random()-0.5).map(x=>x.toString());
}

// TIMER
function startTimer(){
    clearInterval(timerInterval);
    timeLeft = difficulty==="easy"?10:5;

    document.getElementById("timer").innerText="Time: "+timeLeft;

    timerInterval=setInterval(()=>{
        timeLeft--;
        document.getElementById("timer").innerText="Time: "+timeLeft;

        if(timeLeft<=0){
            clearInterval(timerInterval);
            next();
        }
    },1000);
}

// SHOW
function show(){
    const q=questions[current];
    document.getElementById("question").innerText=q.question;

    const ans=document.getElementById("answers");
    ans.innerHTML="";

    startTimer();

    q.answers.map(a=>{
        const btn=document.createElement("button");
        btn.innerText=a;
        btn.onclick=()=>checkAnswer(a,q.correct,btn);
        ans.appendChild(btn);
    });
}

// CHECK
function checkAnswer(answer,correct,btn){
    clearInterval(timerInterval);

    const buttons=document.querySelectorAll("#answers button");
    buttons.forEach(b=>b.disabled=true);

    if(answer===correct){
        btn.classList.add("correct");
        document.body.classList.add("flash-correct");
        score++;
        xp+=difficulty==="easy"?10:20;
    } else {
        btn.classList.add("wrong");
        document.body.classList.add("flash-wrong");

        buttons.forEach(b=>{
            if(b.innerText===correct){
                b.classList.add("correct");
            }
        });
    }

    setTimeout(()=>{
        document.body.classList.remove("flash-correct","flash-wrong");
    },300);
}

// NEXT
function next(){
    const qEl=document.getElementById("question");
    qEl.style.opacity=0;

    setTimeout(()=>{
        current++;
        if(current<questions.length){
            show();
            qEl.style.opacity=1;
        } else {
            finish();
        }
    },300);
}

// RANK
function getRank(xp){
    if(xp<50) return "Bronze";
    if(xp<150) return "Silver";
    return "Gold";
}

// FINISH
async function finish(){
    document.getElementById("score").innerText=`Score: ${score} | XP: ${xp}`;
    document.getElementById("rank").innerText=`Rank: ${getRank(xp)}`;

    alert("🔥 XP Gained: "+xp);

    await fetch("http://127.0.0.1:5000/score",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name:username,score:xp})
    });

    loadLeaderboard();
}

// LEADERBOARD
async function loadLeaderboard(){
    const res=await fetch("http://127.0.0.1:5000/scores");
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

// CHART
function drawChart(data){
    const ctx=document.getElementById("chart");

    if(chartInstance) chartInstance.destroy();

    chartInstance=new Chart(ctx,{
        type:"bar",
        data:{
            labels:data.map(d=>d.name),
            datasets:[{
                label:"XP",
                data:data.map(d=>d.score)
            }]
        }
    });
}