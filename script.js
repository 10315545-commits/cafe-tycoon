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

// Seleccionar avatar
function selectAvatar(avatar) {
    avatarChosen = avatar;
    document.querySelectorAll(".avatarOption").forEach(img => img.style.border = "2px solid transparent");
    document.querySelector(`img[src='images/${avatar}']`).style.border = "2px solid #ff8c00";
}

// Login
function login() {
    playerName = document.getElementById("playerName").value.trim();
    if (!playerName) { alert("Escribe un nombre"); return; }

    // Crear jugador en Firebase
    db.ref("players/" + playerName).set({
        avatar: avatarChosen,
        x: position.x,
        y: position.y
    });

    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("welcome").innerText = `Bienvenido, ${playerName}!`;

    // Escuchar cambios de todos los jugadores
    db.ref("players").on("value", snapshot => {
        const players = snapshot.val();
        renderPlayers(players);
    });

    // Control de movimiento con teclas
    document.addEventListener("keydown", movePlayer);
}

// Renderizar jugadores en pantalla
function renderPlayers(players) {
    const gameArea = document.getElementById("gameArea");
    gameArea.innerHTML = ""; // Limpiar

    for (let p in players) {
        const pl = players[p];
        const div = document.createElement("img");
        div.src = "images/" + pl.avatar;
        div.className = "player";
        div.style.left = pl.x + "px";
        div.style.top = pl.y + "px";
        div.title = p;
        gameArea.appendChild(div);

        // Interacción: click sobre personaje
        div.addEventListener("click", () => {
            if (p !== playerName) alert(`¡Hola ${p}!`);
        });
    }
}

// Mover jugador con teclas
function movePlayer(e) {
    const step = 10;
    if (e.key === "ArrowUp") position.y -= step;
    if (e.key === "ArrowDown") position.y += step;
    if (e.key === "ArrowLeft") position.x -= step;
    if (e.key === "ArrowRight") position.x += step;

    // Mantener dentro del área
    position.x = Math.max(0, Math.min(750, position.x));
    position.y = Math.max(0, Math.min(350, position.y));

    // Actualizar Firebase
    db.ref("players/" + playerName).update(position);
}

