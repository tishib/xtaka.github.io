navigator.serviceWorker.register('sw.js', {scope: '/controlled'}); // First arg is "relative path" from current origin.

navigator.serviceWorker.ready.then(reload);

var sampleIframe = document.getElementById('sample');

sampleIframe.onload = fixHeight;

var reloadBtn = document.querySelector('#reload');
reloadBtn.onclick = reload;

function reload() {
  sampleIframe.contentWindow.location.reload();
}

function fixHeight(evt) {
  var iframe = evt.target;
  var document = iframe.contentWindow.document.documentElement;
  iframe.style.height = document.getClientRects()[0].height + 'px';

  if (window.parent !== window) {
    window.parent.document.body.dispatchEvent(new CustomEvent('iframeresize'));
  }
}
