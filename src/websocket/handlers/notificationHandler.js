// src/websocket/handlers/notificationHandler.js

export const notificationHandler = (io) => {
  const notificationNamespace = io.of('/notifications');

  notificationNamespace.on('connection', (socket) => {
    const { user } = socket;

    // Join user's personal notification room
    socket.join(`user:${user._id}`);

    socket.on('mark-read', async (notificationId) => {
      // Update notification status and broadcast to user's devices
      notificationNamespace.to(`user:${user._id}`).emit('notification-read', {
        notificationId,
        timestamp: new Date()
      });
    });

    socket.on('clear-all', async () => {
      // Clear all notifications and broadcast to user's devices
      notificationNamespace.to(`user:${user._id}`).emit('notifications-cleared', {
        timestamp: new Date()
      });
    });
  });
};
