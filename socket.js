import { io } from "socket.io-client";
import { SOCKET_URL } from "./src/Services/Constants";

const socket = io(SOCKET_URL || "http://52.55.224.49/");

export default socket;
