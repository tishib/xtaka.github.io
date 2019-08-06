'use strict';
const express = require('express');
const path = require('path');
const opn = require('opn');
const port = 8081;
const server = express();

server.use(express.static(path.join(__dirname)));

server.listen(port, () => {
  console.log(`Listening on http:\/\/localhost:${port}`);
  opn(`http:\/\/localhost:${port}`);
});
