'use strict';
(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Registered SW!'))
      .catch(err => console.log('Failed to register SW..., ', err));
  }
  document.querySelector('#show').addEventListener('click', () => {
    const source = document.querySelector('select').selectedOptions[0].value;
    const imgElement = document.createElement('img');
    imgElement.src = source;
    document.querySelector('#container').appendChild(imgElement);
  });
})();