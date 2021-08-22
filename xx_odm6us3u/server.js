const express = require('express');
const path = require('path');
const server = express();
const compression = require('compression');
const port = 8000;
const opts = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['html', 'css']
  };
const publishDir = path.join(__dirname, 'public');

server.use(compression());
server.use(express.static(publishDir, opts));

server.get('/', (req, res) => {
  res.sendFile(path.join(publish, 'index.html'));
});

server.listen(port, () => {
  console.log(`Listten on ${port}`);
});
