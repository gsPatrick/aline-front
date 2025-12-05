        import { io } from "socket.io-client";

    // URL Base do servidor (sem o /api)
    const SOCKET_URL = 'https://sistema-grande-api.zjbwih.easypanel.host';

    let socket;

    export const initSocket = () => {
    if (socket) return socket;

    let token = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('10stats_token');
    }

    socket = io(SOCKET_URL, {
        auth: {
        token: token // Envia o token para autenticação no socket.js do backend
        },
        transports: ['websocket'],
        autoConnect: true,
    });

    socket.on("connect", () => {
        console.log("🟢 Conectado ao WebSocket:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.error("🔴 Erro no WebSocket:", err.message);
    });

    return socket;
    };

    export const getSocket = () => {
    if (!socket) return initSocket();
    return socket;
    };

    export const disconnectSocket = () => {
    if (socket) socket.disconnect();
    };