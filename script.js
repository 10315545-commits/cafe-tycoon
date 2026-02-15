let playerName = "";
let avatarChosen = "avatar1.png";
let position = { x: 100, y: 100 };
let playerElement;

function selectAvatar(avatar) {
    avatarChosen = avatar;
}

function login() {
    playerName = document.getElementById("playerName").value.trim();
    if(!playerName) { alert("Escribe un nombre"); return; }

    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("welcome").innerText = `Bienvenido, ${playerName}!`;

    // Crear jugador en pantalla
    const gameArea = document.getElementById("gameArea");
    playerElement = document.createElement("img");
    playerElement.src = "images/" + avatarChosen;
    playerElement.className = "player";
    playerElement.style.left = position.x + "px";
    playerElement.style.top = position.y + "px";
    gameArea.appendChild(playerElement);
}

function move(direction) {
    const step = 10;
    if(direction === "up") position.y -= step;
    if(direction === "down") position.y += step;
    if(direction === "left") position.x -= step;
    if(direction === "right") position.x += step;

    // Limitar dentro del área
    position.x = Math.max(0, Math.min(450, position.x));
    position.y = Math.max(0, Math.min(250, position.y));

    playerElement.style.left = position.x + "px";
    playerElement.style.top = position.y + "px";
}
