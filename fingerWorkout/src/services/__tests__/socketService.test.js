import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock socket.io-client — returns a fake socket instance.
const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
  connected: true,
};

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket),
}));

// We need fresh module state between tests, so we re-import dynamically.
let socketService;

beforeEach(async () => {
  vi.restoreAllMocks();
  mockSocket.on.mockClear();
  mockSocket.off.mockClear();
  mockSocket.emit.mockClear();
  mockSocket.disconnect.mockClear();
  mockSocket.connected = true;

  // Reset the module so `socket` and `events` are cleared.
  vi.resetModules();
  socketService = await import('../socketService');
});

describe('socketService', () => {
  it('connectSocket creates a socket and registers default events', () => {
    socketService.connectSocket('test@test.com');

    // Default events: connect, disconnect, error
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('connectSocket returns the same socket on subsequent calls', () => {
    const s1 = socketService.connectSocket('a@b.com');
    const s2 = socketService.connectSocket('a@b.com');
    expect(s1).toBe(s2);
  });

  it('emit throws when socket is not connected', async () => {
    // Fresh module — socket is null
    vi.resetModules();
    const freshService = await import('../socketService');
    expect(() => freshService.emit('test', {})).toThrow('Socket not connected');
  });

  it('emit delegates to socket.emit', () => {
    socketService.connectSocket('a@b.com');
    socketService.emit('myEvent', { data: 123 });
    expect(mockSocket.emit).toHaveBeenCalledWith('myEvent', { data: 123 }, undefined);
  });

  it('registerEvents adds handlers to the socket', () => {
    socketService.connectSocket('a@b.com');
    const handler = vi.fn();
    socketService.registerEvents({ customEvent: handler });
    expect(mockSocket.on).toHaveBeenCalledWith('customEvent', handler);
  });

  it('unregisterEvents removes specific handlers', () => {
    socketService.connectSocket('a@b.com');
    const handler = vi.fn();
    socketService.registerEvents({ myEvent: handler });
    socketService.unregisterEvents(['myEvent']);
    expect(mockSocket.off).toHaveBeenCalledWith('myEvent', handler);
  });

  it('unregisterAllEvents removes all registered handlers', () => {
    socketService.connectSocket('a@b.com');
    socketService.registerEvents({ ev1: vi.fn(), ev2: vi.fn() });
    socketService.unregisterAllEvents();
    // off should be called for default events + custom events
    expect(mockSocket.off.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('disconnectSocket cleans up', () => {
    socketService.connectSocket('a@b.com');
    socketService.disconnectSocket();
    expect(mockSocket.disconnect).toHaveBeenCalledOnce();
  });

  it('isConnected reflects socket state', () => {
    socketService.connectSocket('a@b.com');
    expect(socketService.isConnected()).toBe(true);
  });
});
