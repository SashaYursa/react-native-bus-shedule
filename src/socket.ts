import io, { Socket } from 'socket.io-client';

// const URI = 'ws://192.168.0.108:3000/';

// const URI = 'ws://192.168.0.108:8080/';
const URI = 'ws://16.171.152.242:8080/';
const socket: Socket = io(URI, {
	transports: ['websocket'],
	withCredentials: true,
});

export default socket;
