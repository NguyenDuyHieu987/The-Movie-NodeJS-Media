import { Server } from 'socket.io';

class SocketService {
  static io = null;
  static socket = null;

  constructor() {
    if (SocketService.instance) {
      return SocketService.instance; // Trả về instance đã được tạo trước đó
    }

    SocketService.instance = this;
  }

  initialize(server) {
    if (!this.io) {
      this.io = new Server(server, {
        cors: {
          origin: [
            process.env.NODE_ENV != 'production' && 'http://localhost:3000',
            process.env.NODE_ENV != 'production' && 'http://localhost:8080',
            'https://' + process.env.CLIENT_DOMAIN,
            'https://dash.' + process.env.CLIENT_DOMAIN,
            'https://dashboard.' + process.env.CLIENT_DOMAIN,
            // www
            'https://www.' + process.env.CLIENT_DOMAIN,
          ],
          credentials: true,
        },
      });
      this.initializeSocketEvents();
    }
  }

  initializeSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  emitToAll(event, data) {
    this.io.emit(event, data);
  }

  emitToClient(socketId, event, data) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit(event, data);
    }
  }
}

export default new SocketService();
