// Conexão com o servidor local (mudar para a URL do Render no Deploy)
const BACKEND_URL = "http://localhost:3000";
const socket = io(BACKEND_URL);

// Alternar Abas do App
function mudarAba(nomeAba) {
    document.querySelectorAll('.aba-conteudo').forEach(aba => {
        aba.classList.remove('active');
    });
    document.querySelectorAll('.tabs-nav button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`aba-${nomeAba}`).classList.add('active');
    document.getElementById(`btn-${nomeAba}`).classList.add('active');
}

// Enviar Mensagem no Chat
function enviarMensagemChat() {
    const inputUser = document.getElementById('input-usuario');
    const inputMsg = document.getElementById('input-msg');

    const usuario = inputUser.value.trim() || "Guerreiro Anônimo";
    const texto = inputMsg.value.trim();

    if (texto !== "") {
        socket.emit('enviar_mensagem', { usuario, texto });
        inputMsg.value = ""; // Limpa campo de texto
    }
}

// Receber Mensagem do Servidor
socket.on('receber_mensagem', (dados) => {
    const historico = document.getElementById('historico-chat');
    
    const msgHTML = `
        <div class="msg-item">
            <div class="msg-user">${dados.usuario}</div>
            <div class="msg-texto">${dados.texto}</div>
            <div class="msg-meta">${dados.horario}</div>
        </div>
    `;
    
    historico.innerHTML += msgHTML;
    historico.scrollTop = historico.scrollHeight; // Rola para o fim
});

// Chamar API da IA Katartismos
async function consultarIA(sentimento) {
    const respostaBox = document.getElementById('resposta-ia');
    respostaBox.innerText = "Buscando antídoto na central Katartismos...";

    try {
        const resposta = await fetch(`${BACKEND_URL}/api/ia-katartismos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sentimento })
        });
        const dados = await resposta.json();
        respostaBox.innerText = dados.mensagem;
    } catch (erro) {
        respostaBox.innerText = "Conexão interrompida. Certifique-se de que o backend está ligado.";
        console.error(erro);
    }
}

// Registrar o Service Worker da PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log("PWA: Service Worker Ativo"))
            .catch(err => console.log("PWA: Falha ao ativar SW", err));
    });
}