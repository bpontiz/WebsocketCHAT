const socket = io();

const buttonSend = document.getElementById('buttonSend');
buttonSend.addEventListener('click', () => {
    const inputMessage = document.getElementById("messageInput");
    socket.emit('message', inputMessage.value);
});

socket.on('messages', data => {
    const showMessages = data.map(mssg => 
        `SocketID ${mssg.socketId}: ${mssg.message}`
    ).join('<br>');

    const queryP = document.querySelector('p');
    queryP.innerHTML = showMessages;
})