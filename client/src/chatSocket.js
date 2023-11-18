import { io } from "socket.io-client";

const socket = io("http://localhost:8900");

// here the socket.id is not printing, i feel reason is that it is taking time to assign things to the socket variable
console.log("socket#$#$#$#$#$#$#$#$#$#$#", socket, socket.id);

export default socket;
