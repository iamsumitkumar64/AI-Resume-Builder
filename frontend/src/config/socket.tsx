import { io } from "socket.io-client";
import backend_url from "../Libs/env";

export const socket = io(backend_url); 