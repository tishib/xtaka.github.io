const express = require('express');
const path = require('path');
const server = express();
const compression = require('compression');
const port = 8000;

server.use(compression());
server.use(express.static(__dirname));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => {
  console.log(`Listten on ${port}`);
});
