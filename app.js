const ws1 = new WebSocket('http://localhost:3001/');

let meuID ;
  
ws1.addEventListener('message', function (event) {
    atualizaChat(event.data);
});

ws1.addEventListener('error', function (event) {
  console.log('Conexão fechada por erro.');
  ws1.close();
});

function atualizaChat(mensagem){
  
  let saida = mensagem.split(',');

  if(saida[0] == 999){
    meuID = saida[1];
    console.log(`Chegou meu id = ${meuID}`);
  }
  else{

      if(saida[1]==meuID){
        let chatGeral = document.getElementById("chat");
        let novaMensagem = document.createElement("div");
        novaMensagem.classList.add('message', 'user1');
        novaMensagem.textContent = saida[2] ;
        chatGeral.appendChild(novaMensagem);
      }
      else{
        let chatGeral = document.getElementById("chat");
        let novaMensagem = document.createElement("div");
        novaMensagem.classList.add('message', 'user2');
        novaMensagem.textContent = saida[2] ;
        chatGeral.appendChild(novaMensagem);
      }

  }

}


document.getElementById('txtmsg').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const texto = event.target.value;    
    event.target.value = '';
    ws1.send(texto);
  }
});