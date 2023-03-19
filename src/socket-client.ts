import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = ( token: string ) => {

    // localhost:3000/socket.io/socket.io.js
    const manager = new Manager('localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            Hola: 'Buenas mundo',
            authentication: token
        }
    })

    socket?.removeAllListeners()
    socket = manager.socket('/');

    addListeners()
    
}

const addListeners = ( ) => {
    
    const serverStatusLabel = document.querySelector('#server-status')!;
    const clientsUl = document.querySelector('#clients-ul')!;
    
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
    const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect')!;

    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'connected';
        // btnConnect.style.display = 'none'
        // btnConnect.disabled = true;
    });
    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'disconnected'
        // btnConnect.disabled = false;
        // btnConnect.style.display = 'block'
    });

    // Llena el UL 
    socket.on('updated-client', ( clients: string[]) => {
        let clientsHtml = '';
        clients.forEach( clientId => {
            clientsHtml += `
            <li>${clientId}</li>`
        });

        clientsUl.innerHTML = clientsHtml;
    })

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if( messageInput.value.trim().length <= 0 ) return;

        socket.emit('message-from-client', {id: 'YO', msg: messageInput.value});

        messageInput.value = '';

    })
    // estamos escuchando del server y lo que responda cae en el payload
    socket.on('message-from-server', (payload: {fullName: string, msg: string}) => {
        const newMessages = `
            <li>
                <strong>${payload.fullName}</strong>,
                <span>${payload.msg}</span>
            </li>
        `
        const newLi = document.createElement('LI');
        newLi.innerHTML = newMessages;
        messagesUl.appendChild ( newLi )

    });

}

