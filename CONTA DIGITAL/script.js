const dadosBancarios = {
    saldo: 0,
    totalEntradas: 0,
    totalSaidas: 0,
    transacoes: []
};

function carregarDados() {
    const dadosArmazenados = localStorage.getItem('dadosBancarios');
    if (dadosArmazenados) {
        const dados = JSON.parse(dadosArmazenados);
        dadosBancarios.saldo = dados.saldo;
        dadosBancarios.totalEntradas = dados.totalEntradas;
        dadosBancarios.totalSaidas = dados.totalSaidas;
        dadosBancarios.transacoes = dados.transacoes;
    }
}

function salvarDados() {
    localStorage.setItem('dadosBancarios', JSON.stringify(dadosBancarios));
}

function formatarMoeda(valor) {
    return valor.toFixed(2).replace('.', ',');
}

function atualizarExibicao() {
    document.getElementById('saldo').textContent = formatarMoeda(dadosBancarios.saldo);
    document.getElementById('total-entradas').textContent = formatarMoeda(dadosBancarios.totalEntradas);
    document.getElementById('total-saidas').textContent = formatarMoeda(dadosBancarios.totalSaidas);
}

function gerarIdTransacao() {
    const agora = new Date();
    return `${agora.getFullYear()}${(agora.getMonth() + 1).toString().padStart(2, '0')}${agora.getDate().toString().padStart(2, '0')}${agora.getHours().toString().padStart(2, '0')}${agora.getMinutes().toString().padStart(2, '0')}${agora.getSeconds().toString().padStart(2, '0')}`;
}

function criarHtmlTransacao(transacao) {
    return `
        <div class="item-transacao">
            <div>
                <div>${transacao.tipo === 'receber' ? 'Transferência recebida' : 'Transferência enviada'}</div>
                <div>${new Date(transacao.data).toLocaleString()}</div>
                <div>ID: ${transacao.id}</div>
            </div>
            <div class="${transacao.tipo === 'receber' ? 'entrada' : 'saida'}">
                R$ ${formatarMoeda(transacao.valor)}
            </div>
        </div>
    `;
}

function adicionarTransacao(tipo, valor) {
    const transacao = {
        id: gerarIdTransacao(),
        tipo: tipo,
        valor: valor,
        data: new Date().toISOString()
    };

    dadosBancarios.transacoes.unshift(transacao);
    salvarDados();

    document.getElementById('sem-transacoes').style.display = 'none';
    document.getElementById('transacoes').insertAdjacentHTML('afterbegin', criarHtmlTransacao(transacao));
}

function carregarTransacoes() {
    const transacoesContainer = document.getElementById('transacoes');
    if (dadosBancarios.transacoes.length > 0) {
        document.getElementById('sem-transacoes').style.display = 'none';
        const htmlTransacoes = dadosBancarios.transacoes
            .map(transacao => criarHtmlTransacao(transacao))
            .join('');
        transacoesContainer.innerHTML = htmlTransacoes;
    }
}

function manipularTransacao(tipo, idFormulario) {
    const formulario = document.getElementById(idFormulario);
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputValor = document.getElementById(`${tipo}-valor`);
        const valor = parseFloat(inputValor.value);
        const outroInput = document.getElementById(`${tipo}-${tipo === 'receber' ? 'documento' : 'chave'}`);
        
        if (!valor || !outroInput.value) {
            formulario.querySelector('.mensagem-erro').style.display = 'block';
            return;
        }

        if (tipo === 'transferir' && valor > dadosBancarios.saldo) {
            alert('Saldo insuficiente!');
            return;
        }

        if (tipo === 'receber') {
            dadosBancarios.saldo += valor;
            dadosBancarios.totalEntradas += valor;
        } else {
            dadosBancarios.saldo -= valor;
            dadosBancarios.totalSaidas += valor;
        }

        atualizarExibicao();
        adicionarTransacao(tipo, valor);
        alert('Transação realizada com sucesso');
        
        formulario.reset();
        formulario.querySelector('.mensagem-erro').style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {

    carregarDados();
    atualizarExibicao();
    carregarTransacoes();

    document.getElementById('botao-pix').addEventListener('click', () => {
        document.getElementById('area-pix').style.display = 'block';
    });

    document.querySelectorAll('.botao-aba').forEach(botao => {
        botao.addEventListener('click', () => {

            document.querySelectorAll('.botao-aba').forEach(btn => btn.classList.remove('ativo'));
            botao.classList.add('ativo');

            document.querySelectorAll('.formulario-pix').forEach(form => form.classList.remove('ativo'));
            document.querySelector(`#formulario-${botao.dataset.aba}`).classList.add('ativo');
        });
    });

    document.getElementById('botao-pagar').addEventListener('click', () => {
        alert('Sistema indisponível. Tente novamente mais tarde.');
    });

    document.getElementById('botao-investir').addEventListener('click', () => {
        alert('Sistema indisponível. Tente novamente mais tarde.');
    });

    manipularTransacao('receber', 'formulario-receber');
    manipularTransacao('transferir', 'formulario-transferir');
});