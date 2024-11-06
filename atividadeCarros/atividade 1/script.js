
const divResultado = document.getElementById('result');
const corpo = document.body;
const carroBranco = document.getElementById('white');
const carroVermelho = document.getElementById('red');
const botaoAcelerar = document.getElementById('acelerar');
const botaoDesacelerar = document.getElementById('desacelerar');
const botaoResetar = document.getElementById('resetar');

let velocidade = 1;
let carroSelecionado = null;

function selecionarCarro(cor) {
    carroSelecionado = cor;
    divResultado.innerText = cor.charAt(0).toUpperCase() + cor.slice(1);
    corpo.style.backgroundColor = cor === 'branco' ? 'lightgray' : 'darkred';
}

function acelerar() {
    velocidade -= 0.5;
    atualizarTamanhoCarro();
}

function desacelerar() {
    velocidade = Math.max(1, velocidade + 0.5); 
    atualizarTamanhoCarro();
}


function atualizarTamanhoCarro() {
    const tamanho = 50 + (velocidade * 5); 
    if (carroSelecionado === 'branco') {
        carroBranco.style.width = `${tamanho}px`;
        carroBranco.style.height = `${tamanho}px`;
    } else if (carroSelecionado === 'vermelho') {
        carroVermelho.style.width = `${tamanho}px`;
        carroVermelho.style.height = `${tamanho}px`;
    }
}


function resetar() {
    velocidade = 1;
    carroSelecionado = null;
    divResultado.innerText = '?';
    corpo.style.backgroundColor = 'black';
    carroBranco.style.width = '50px';
    carroBranco.style.height = '50px';
    carroVermelho.style.width = '50px';
    carroVermelho.style.height = '50px';
}

document.getElementById('branco').addEventListener('click', () => selecionarCarro('branco'));
document.getElementById('vermelho').addEventListener('click', () => selecionarCarro('vermelho'));
botaoResetar.addEventListener('click', resetar);
botaoAcelerar.addEventListener('click', acelerar);
botaoDesacelerar.addEventListener('click', desacelerar);

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowUp') {
        acelerar();
    } else if (evento.key === 'ArrowDown') {
        desacelerar();
    }
});