const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Permite que o seu frontend (Vercel) converse com o backend (Render)
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Configuração do Socket.io para tempo real
const io = new Server(server, {
    cors: {
        origin: "*", // Em produção, podemos restringir para a URL da Vercel
        methods: ["GET", "POST"]
    }
});

// Rota base para testar se o servidor está online
app.get('/', (req, res) => {
    res.send('Servidor Katartismos Operacional. ⚡');
});

// Rota da IA Katartismos (Antídotos mentais diários)
app.post('/api/ia-katartismos', (req, res) => {
    const { sentimento } = req.body;
    let resposta = "";

    // Lógica inicial com respostas diretas e focadas. 
    // Futuramente, podemos plugar a API do Gemini aqui!
    switch (sentimento) {
        case 'duvida':
            resposta = "A clareza vem da ação, não do pensamento. Escolha um caminho agora e avance com convicção.";
            break;
        case 'medo':
            resposta = "O medo é uma ilusão que se alimenta da sua paralisia. O Katartismos exige coragem. Avance mesmo trêmulo.";
            break;
        case 'vergonha':
            resposta = "Seu passado ou os julgamentos alheios não definem sua realeza. Erga a cabeça, o foco está no seu propósito.";
            break;
        case 'preguiça':
            resposta = "A inércia é o túmulo do progresso. Quebre a tarefa no menor pedaço possível e faça a primeira ação por 5 minutos.";
            break;
        case 'raiva':
            resposta = "A raiva é combustível, mas se você não controlá-la, ela queimará você. Canalize essa energia em esforço nos exercícios.";
            break;
        default:
            resposta = "Mantenha o foco. O processo de restauração está ativo.";
    }

    res.json({ mensagem: resposta });
});

// Gerenciamento de conexões do Chat
io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    // Ouvindo quando alguém envia uma mensagem no chat
    socket.on('enviar_mensagem', (dados) => {
        // Envia a mensagem para todo mundo que está conectado no app
        io.emit('receber_mensagem', {
            usuario: dados.usuario || "Anônimo",
            texto: dados.texto,
            horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        });
    });

    socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.id}`);
    });
});

// Porta do servidor (o Render define isso automaticamente em produção)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[Katartismos] Servidor rodando com sucesso na porta ${PORT}`);
});