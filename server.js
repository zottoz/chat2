const WebSocket = require('ws');
const express = require('express'); // Usar express apenas para middleware CORS
const cors = require('cors');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

//const server = new WebSocket.Server({ port: 3001 });

const app = express();

// Middleware CORS
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


let clients = [];

let mensagemCompleta = [];

wss.on('connection', ws => {
  
  let clientId = uuidv4();

  clients[clientId] = ws;
  console.log(`Cliente conectado: ${clientId}`);

  // envia a mensagem com o id do cliente conectado
  mensagemCompleta =[
    999,
    clientId,
    ''
  ]
  ws.send(mensagemCompleta.toString());

  // Quando o servidor recebe uma mensagem do cliente
  ws.on('message', message => {


    //envia msg para todos
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          // cria uma nova mensagem
          mensagemCompleta =[
            1,
            clientId,
            message.toString()
          ]
          client.send(mensagemCompleta.toString());
          console.log(`Cliente: ${clientId} - ${message.toString()}`);
        }

    });

    // Manipulador para erros
    ws.on('error', (error) => {
        console.error('Cliente ERRO:', error);
    });

  }); //fim


  //Quando a conexao com o cliente é fechada
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });

});

// Manipulador para erros do servidor WebSocket
server.on('error', (error) => {
  console.error('Erro no Servidor:', error);
});

// Iniciar o servidor
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket rodando em http://localhost:${PORT}`);
});

