const socket = io();

function userMessage(e) {
    const emailInput = document.getElementById("emailInput");
    const messageInput = document.getElementById("messageInput");
    const time = new Date();
    const showTime = `
        (${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()})
    `;
    const newMessage = {
        email: emailInput.value,
        dateTime: showTime,
        message: messageInput.value
    };

    socket.emit('message', newMessage);
};

socket.on('messages', arrayMessages => {
    const showMessages = arrayMessages.map(mssg =>
        `<div style="display: flex; flex-direction: row;">
            <p style="font-weight: bold; color: navy;">${mssg.email}</p>
            <p style="color: brown;">${mssg.dateTime}</p>
            <p style="font-style: italic; color: green;">${mssg.message}</p>
        </div>`).join("<br>");

    const queryDivChat = document.getElementById("pChatStyle");
    queryDivChat.innerHTML = showMessages;
});