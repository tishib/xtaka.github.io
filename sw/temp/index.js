'use strict';
(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }
  document.querySelector('#show').addEventListener('click', () => {
    const source = document.querySelector('select').selectedOptions[0].value;
    const imgElement = document.createElement('img');
    imgElement.src = source;
    document.querySelector('#container').appendChild(imgElement);
  });
})();