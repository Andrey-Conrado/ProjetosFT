let ws;
let playerId;
let roomId;
let myChoice = null;
let scores = { me: 0, opponent: 0 };

// Conecta à sala
function conectarSala() {
    roomId = document.getElementById('roomId').value;
    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
        console.log('Conectado ao servidor');
        ws.send(JSON.stringify({ type: 'join', roomId: roomId }));

        document.getElementById('connectionScreen').classList.add('hidden');
        document.getElementById('waitingScreen').classList.remove('hidden');
        document.getElementById('currentRoom').textContent = roomId;
    };

    ws.onmessage = receberMensagem;
    ws.onclose = () => {
        alert('Conexão perdida. Recarregue a página para reconectar.');
    };
}

// Recebe mensagens do servidor
function receberMensagem(event) {
    const data = JSON.parse(event.data);

    switch (data.type) {
        case 'gameStart':
            iniciarJogo(data.playerId);
            break;
        case 'playerChoice':
            if (data.playerId !== playerId) {
                processarEscolhaOponente(data.choice);
            }
            break;
        case 'restart':
            reiniciarJogo();
            break;
    }
}

// Inicia o jogo
function iniciarJogo(pid) {
    playerId = pid;
    document.getElementById('waitingScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
}

// Faz uma escolha
function fazerEscolha(choice) {
    myChoice = choice;
    document.getElementById('myChoice').textContent = `Sua escolha: ${choice}`;
    [...document.getElementsByClassName('choice-btn')].forEach(btn => btn.disabled = true);

    ws.send(JSON.stringify({ type: 'playerChoice', playerId: playerId, roomId: roomId, choice: choice }));
}

// Processa a escolha do oponente
function processarEscolhaOponente(opponentChoice) {
    const resultDiv = document.getElementById('gameResult');
    let result;

    if (myChoice === opponentChoice) result = 'Empate!';
    else if ((myChoice === 'pedra' && opponentChoice === 'tesoura') || 
             (myChoice === 'tesoura' && opponentChoice === 'papel') || 
             (myChoice === 'papel' && opponentChoice === 'pedra')) {
        result = 'Você venceu!';
        scores.me++;
    } else {
        result = 'Você perdeu!';
        scores.opponent++;
    }

    document.getElementById('myScore').textContent = scores.me;
    document.getElementById('opponentScore').textContent = scores.opponent;

    resultDiv.textContent = `${result} (${myChoice} vs ${opponentChoice})`;
    resultDiv.classList.remove('hidden');
    document.getElementById('resetButton').classList.remove('hidden');
}

// Reinicia o jogo
function jogarNovamente() {
    myChoice = null;
    document.getElementById('myChoice').textContent = '';
    document.getElementById('gameResult').classList.add('hidden');
    document.getElementById('resetButton').classList.add('hidden');
    [...document.getElementsByClassName('choice-btn')].forEach(btn => btn.disabled = false);

    ws.send(JSON.stringify({ type: 'restart', playerId: playerId, roomId: roomId }));
}

// Reinicia quando o oponente solicita
function reiniciarJogo() {
    jogarNovamente();
}
