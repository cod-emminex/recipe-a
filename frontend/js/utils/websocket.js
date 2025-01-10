// frontend/js/utils/websocket.js
import { WS_URL } from "../api/config.js";

class WebSocketClient {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.handlers = new Map();
  }

  connect() {
    try {
      this.socket = new WebSocket(WS_URL);
      this.setupEventListeners();
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.handleReconnect();
    }
  }

  setupEventListeners() {
    this.socket.addEventListener("open", () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
    });

    this.socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    this.socket.addEventListener("close", () => {
      console.log("WebSocket disconnected");
      this.handleReconnect();
    });

    this.socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(
        () => this.connect(),
        this.reconnectDelay * this.reconnectAttempts
      );
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  handleMessage(data) {
    const handler = this.handlers.get(data.type);
    if (handler) {
      handler(data.payload);
    }
  }

  on(type, handler) {
    this.handlers.set(type, handler);
  }

  emit(type, payload) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const ws = new WebSocketClient();

export const initializeWebSocket = () => {
  ws.connect();
};
