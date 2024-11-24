const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const rooms = {}; // Armazena as salas e os jogadores nelas

console.log('Servidor WebSocket rodando em ws://localhost:8080');

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'join') {
            const roomId = data.roomId;

            if (!rooms[roomId]) {
                rooms[roomId] = [];
            }

            // Adiciona o jogador à sala
            rooms[roomId].push(ws);

            console.log(`Jogador entrou na sala: ${roomId} (${rooms[roomId].length} jogador(es))`);

            // Se dois jogadores estiverem na sala, inicia o jogo
            if (rooms[roomId].length === 2) {
                rooms[roomId].forEach((player, index) => {
                    player.send(JSON.stringify({
                        type: 'gameStart',
                        playerId: index + 1
                    }));
                });
            }
        } else if (data.type === 'playerChoice') {
            // Transmite a escolha para o oponente
            const roomId = data.roomId;
            const opponent = rooms[roomId].find((player) => player !== ws);
            if (opponent) {
                opponent.send(JSON.stringify({
                    type: 'playerChoice',
                    playerId: data.playerId,
                    choice: data.choice
                }));
            }
        } else if (data.type === 'restart') {
            // Notifica o oponente para reiniciar o jogo
            const roomId = data.roomId;
            const opponent = rooms[roomId].find((player) => player !== ws);
            if (opponent) {
                opponent.send(JSON.stringify({
                    type: 'restart',
                    playerId: data.playerId
                }));
            }
        }
    });

    ws.on('close', () => {
        // Remove o jogador desconectado de todas as salas
        for (const roomId in rooms) {
            rooms[roomId] = rooms[roomId].filter((player) => player !== ws);

            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            }
        }
        console.log('Um jogador desconectou.');
    });
});
