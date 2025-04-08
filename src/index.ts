import { WebSocketServer, WebSocket } from 'ws'

const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' })

interface User {
    socket: WebSocket,
    room: string
}

let allSockets: User[] = [];

wss.on('connection', (socket) => {
    console.log('new connection')
    // allSockets.push(socket)
    socket.on('message', (msg) => {
        console.log(msg.toString())
        // @ts-ignore
        const parsedMessage = JSON.parse(msg)
        if (parsedMessage.type === 'join') {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }
        if (parsedMessage.type == 'chat') {
            let currentUserRoom = null;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket == socket) {
                    currentUserRoom = allSockets[i].room
                }
            }
            if (currentUserRoom) {
                for (let i = 0; i < allSockets.length; i++) {
                    if (allSockets[i].room == currentUserRoom) {
                        allSockets[i].socket.send(
                            JSON.stringify({ 
                                messages: parsedMessage.payload.message, 
                                userName: parsedMessage.payload.userName 
                            })
                        )
                    }
                }
            }
        }
    })
})

/* 
{
    "type" : "join",
    "payload" : {
        "roomId" : "123"
    }
}
*/