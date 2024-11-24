const display = document.getElementById("display");


function porNumero(value) {
    if (display.textContent === "" || display.textContent === "Erro") {
        display.textContent = value;
    } else {
        display.textContent += value;
    }
}
function limpar() {
    display.textContent = "";
}

function apagar() {
    display.textContent = display.textContent.slice(0, -1);
    if (display.textContent === "") {
        display.textContent = "0";
    }
}

function porcentagem() {
    try {
        const value = parseFloat(display.textContent);
        if (!isNaN(value)) {
            display.textContent = (value / 100).toString();
        } else {
            display.textContent = "Erro";
        }
    } catch (error) {
        display.textContent = "Erro";
    }
}
function calcular() {
    try {
        const expression = display.textContent.replace("x", "*");
        const result = eval(expression);
        display.textContent = result;
    } catch (error) {
        display.textContent = "Erro";
    }
}
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent.trim();

        switch (value) {
            case "%":
                porcentagem();
                break;
            case "C":
                limpar();
                break;
            case "<":
                apagar();
                break;
            case "=":
                calcular();
                break;
            case ".":
                porNumero(".");
                break;
            case "+":
            case "-":
            case "x":
            case "/":
                porNumero(` ${value} `); 
                break;
            default:
                porNumero(value);
                break;
        }
    });
});