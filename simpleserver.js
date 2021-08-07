const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.static(__dirname));

let port = 80;
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});