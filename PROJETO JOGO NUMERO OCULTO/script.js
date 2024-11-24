let chute = document.getElementById('chute');
const mens = document.getElementById('mensagem');
// mens --> mensagem
const tenres = document.getElementById('tentativas')
// tenres --> tentativas restantes
let num = Math.floor(Math.random() * 50) + 1;
// num --> numero aleatorio selecionado
let tentativas= 5;

function checar() {
    let chutedado = Number(chute.value);
    if (tentativas === 0) {
        tenres.textContent = `Tentativas restantes: ${tentativas}`
        mens.textContent = `Acabaram as tentativas. O número oculto era ${num}.
        Reinicie para tentar novamente`;
        return;
    }
    if (chutedado === num) {
        mens.textContent = "Parabéns! Você acertou!";
        return;
    } else if (chutedado < num) {
        mens.textContent = "O número oculto é maior.";
    } else {
        mens.textContent = "O número oculto é menor.";
    }
    tentativas--;
    chute.value = '';
    tenres.textContent = `Tentativas restantes: ${tentativas}`;
}