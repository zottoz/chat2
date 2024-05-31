const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const server = new WebSocket.Server({ port: 3001 });

let clients = [];

let mensagemCompleta = [];

server.on('connection', ws => {
  
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
    server.clients.forEach(client => {
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

console.log('WebSocket server is running on ws://localhost:3001');
