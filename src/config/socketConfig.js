import { Server } from 'socket.io';

export function socketConf(httpServer) {
    const io = new Server(httpServer);
    io.on('connection', (socket) => {
        console.log('Un cliente se ha conectado');
    });
    return io;
}
