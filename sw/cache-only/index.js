navigator.serviceWorker.register('/sw/cache-only/sw.js', {scope: '/sw/cache-only/'});

navigator.serviceWorker.ready.then(reload);

var sampleIframe = document.getElementById('sample');

sampleIframe.onload = fixHeight;

var reloadBtn = document.querySelector('#reload');
reloadBtn.onclick = reload;

function fixHeight(evt) {
  var iframe = evt.target;
  var document = iframe.contentWindow.document.documentElement;
  iframe.style.height = document.getClientRects()[0].height + 'px';
  
  if (window.parent !== window) {
    window.parent.document.body.dispatchEvent(new CustomEvent('iframeresize'));
  }
}

function reload() {
  sampleIframe.contentWindow.location.reload();
}
