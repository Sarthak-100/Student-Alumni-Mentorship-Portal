import { io } from "socket.io-client";

const socket = io("http://localhost:8900");

console.log("socket#$#$#$#$#$#$#$#$#$#$#", socket, socket.id);

export default socket;