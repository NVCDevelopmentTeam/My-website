import express from "express";
import { handler } from "./build/handler.js";
import { attachSockets } from "./sockets.js";

const PORT = 3000;
const app = express();
const server = app.listen(PORT, () => {
    console.log("server is listening on port", PORT);
});

app.use(handler);
attachSockets(server);

