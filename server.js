const express = require("express");
const { handler } = require("./build/handler.js");
const { attach_sockets } = require("./sockets.js");

const PORT = 3000;
const app = express();
const server = app.listen(PORT, () => {
    console.log("server is listening on port", PORT);
});

app.use(handler);
attach_sockets(server);