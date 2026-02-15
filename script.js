let money = 0;
let businessLevel = 1;
let coffeePrice = 10;

function earnMoney() {
    money += coffeePrice;
    updateDisplay();
}

function upgradeBusiness() {
    let cost = 100 * businessLevel; // aumenta el costo con cada nivel
    if (money >= cost) {
        money -= cost;
        businessLevel++;
        coffeePrice += 5; // aumenta ganancias por café
        updateDisplay();
    } else {
        alert("No tienes suficiente dinero para mejorar.");
    }
}

function updateDisplay() {
    document.getElementById("money").innerText = "Dinero: $" + money;
    document.getElementById("level").innerText = "Nivel de negocio: " + businessLevel;
    document.getElementById("income").innerText = "Ingreso por café: $" + coffeePrice;
}
