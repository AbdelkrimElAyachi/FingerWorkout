
// socketService.js
import { io } from "socket.io-client";

let socket;
let events = {};

const defaultEvents = {
  connect: () => console.log("✅ Connected to server"),
  disconnect: () => console.log("❌ Disconnected from server"),
  error: (err) => console.error("⚠️ Socket error:", err),
};

export function connectSocket(email, url = "http://localhost:3001") {
  if (!socket) {
    socket = io(url, { autoConnect: true, auth: { email: email } });

    registerEvents(defaultEvents);
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    events = {};
  }
}

export function emit(event, payload, cb) {
  if (!socket) throw new Error("Socket not connected");
  socket.emit(event, payload, cb);
}

// Add extra events (per page / component)
export function registerEvents(newEvents) {
  if (!socket) throw new Error("Socket not connected");

  events = { ...events, ...newEvents };

  Object.entries(newEvents).forEach(([event, handler]) => {
    socket.on(event, handler);
  });
}

/**
 * Removes specific event listeners from the socket.
 * @param {string[]} eventNames - Array of event names to unregister.
 */
export function unregisterEvents(eventNames = []) {
  if (!socket) return;

  eventNames.forEach((event) => {
    if (events[event]) {
      socket.off(event, events[event])
      delete events[event]
    }
  });
}

export function unregisterAllEvents() {
  if (!socket) return;

  Object.keys(events).forEach((event) => {
    socket.off(event, events[event]);
  });
  events = {};
}

export function isConnected() {
  return socket?.connected ?? false;
}
