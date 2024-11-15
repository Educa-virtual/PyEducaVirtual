const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const clients = new Set();

server.on('connection', (socket) => {
  console.log('Cliente conectado.');
  clients.add(socket);

  socket.on('message', (message) => {
    try {
      // Si el mensaje recibido no es un objeto, lo tratamos como JSON
      const data = typeof message === 'string' ? JSON.parse(message) : message;
      console.log('Mensaje recibido del cliente:', data);

      // Crear un objeto JSON para enviar a los clientes
      const payload = JSON.stringify({
        type: 'newMessage',
        data: data,
      });

      // Enviar el objeto JSON a todos los clientes conectados
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    } catch (error) {
      console.error('Error al procesar el mensaje:', error);
    }
  });

  socket.on('close', () => {
    console.log('Cliente desconectado.');
    clients.delete(socket);
  });
});

console.log('Servidor WebSocket ejecutándose en ws://localhost:8080');
