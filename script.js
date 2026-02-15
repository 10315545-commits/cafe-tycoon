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
let money = 0;
let level = 1;
let income = 10;

// Login
function login() {
    playerName = document.getElementById("playerName").value.trim();
    if (!playerName) { alert("Escribe un nombre de personaje"); return; }

    // Crear jugador en la base de datos si no existe
    db.ref("players/" + playerName).set({
        money: 0,
        level: 1,
        income: 10
    });

    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("welcome").innerText = `Bienvenido, ${playerName}!`;

    listenPlayerData();
    listenRanking();
}

// Escuchar cambios de tu jugador
function listenPlayerData() {
    db.ref("players/" + playerName).on("value", snapshot => {
        const data = snapshot.val();
        money = data.money;
        level = data.level;
        income = data.income;
        updateDisplay();
    });
}

// Escuchar ranking de todos los jugadores
function listenRanking() {
    db.ref("players").on("value", snapshot => {
        const players = snapshot.val();
        const ranking = Object.keys(players)
            .map(p => ({name: p, money: players[p].money}))
            .sort((a,b) => b.money - a.money);

        const rankingEl = document.getElementById("ranking");
        rankingEl.innerHTML = "";
        ranking.forEach(p => {
            const li = document.createElement("li");
            li.innerText = `${p.name}: $${p.money}`;
            rankingEl.appendChild(li);
        });
    });
}

// Ganar dinero
function earnMoney() {
    money += income;
    db.ref("players/" + playerName).update({ money });
}

// Mejorar negocio
function upgradeBusiness() {
    let cost = 100 * level;
    if (money >= cost) {
        money -= cost;
        level++;
        income += 5;
        db.ref("players/" + playerName).update({ money, level, income });
    } else {
        alert("No tienes suficiente dinero para mejorar.");
    }
}

// Actualizar pantalla
function updateDisplay() {
    document.getElementById("money").innerText = `Dinero: $${money}`;
    document.getElementById("level").innerText = `Nivel de negocio: ${level}`;
    document.getElementById("income").innerText = `Ingreso por café: $${income}`;
}
