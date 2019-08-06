'use strict';
console.log('run');
d3.csv('/data.csv')
  .then(data => { console.log(data) });
