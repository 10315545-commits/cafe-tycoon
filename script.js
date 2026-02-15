// Configura Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://TU_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let playerName = "";
let avatarChosen = "avatar1.png";
let position = { x: 100, y: 100 };
let money = 0;
let level = 1;
let income = 10;
let playerElement;

// Selección de avatar
function selectAvatar(avatar) {
    avatarChosen = avatar;
    document.querySelectorAll(".avatarOption").forEach(img => img.style.border="2px solid transparent");
    document.querySelector(`img[src='images/${avatar}']`).style.border="2px solid #ff8c00";
}

// Login
function login() {
    playerName = document.getElementById("playerName").value.trim();
    if(!playerName){ alert("Escribe un nombre"); return; }

    db.ref("players/" + playerName).set({
        avatar: avatarChosen,
        x: position.x,
        y: position.y,
        money: money,
        level: level,
        income: income
    });

    document.getElementById("login").style.display="none";
    document.getElementById("game").style.display="block";
    document.getElementById("welcome").innerText = `Bienvenido, ${playerName}!`;

    db.ref("players").on("value", snapshot => {
        const players = snapshot.val();
        renderPlayers(players);
        renderRanking(players);
    });
}

// Renderizar jugadores
function renderPlayers(players){
    const gameArea = document.getElementById("gameArea");
    gameArea.innerHTML="";
    for(let p in players){
        const pl = players[p];
        const div = document.createElement("img");
        div.src="images/"+pl.avatar;
        div.className="player";
        div.style.left=pl.x+"px";
        div.style.top=pl.y+"px";
        div.title=p;

        div.addEventListener("click", ()=>{
            if(p!==playerName) alert(`¡Hola ${p}!`);
        });

        gameArea.appendChild(div);
    }
}

// Movimiento con botones
function movePlayer(dir){
    const step = 10;
    if(dir==="up") position.y-=step;
    if(dir==="down") position.y+=step;
    if(dir==="left") position.x-=step;
    if(dir==="right") position.x+=step;

    position.x = Math.max(0, Math.min(750, position.x));
    position.y = Math.max(0, Math.min(350, position.y));

    db.ref("players/"+playerName).update(position);
}

// Acciones
function earnMoney(){
    money+=income;
    db.ref("players/"+playerName).update({money});
}

function upgradeBusiness(){
    let cost=100*level;
    if(money>=cost){
        money-=cost;
        level++;
        income+=5;
        db.ref("players/"+playerName).update({money, level, income});
    } else {
        alert("No tienes suficiente dinero");
    }
}

// Ranking
function renderRanking(players){
    const rankingEl = document.getElementById("ranking");
    rankingEl.innerHTML="";
    const list = Object.keys(players)
        .map(p=>({name:p, money:players[p].money, avatar:players[p].avatar}))
        .sort((a,b)=>b.money-a.money);

    list.forEach(p=>{
        const li=document.createElement("li");
        const img=document.createElement("img");
        img.src="images/"+p.avatar;
        img.width=30;
        img.style.verticalAlign="middle";
        img.style.marginRight="10px";

        li.appendChild(img);
        li.append(`${p.name}: $${p.money}`);
        rankingEl.appendChild(li);
    });

    const playerData = players[playerName];
    if(playerData){
        document.getElementById("money").innerText=`Dinero: $${playerData.money}`;
        document.getElementById("level").innerText=`Nivel: ${playerData.level}`;
        document.getElementById("income").innerText=`Ingreso por café: $${playerData.income}`;
    }
}

