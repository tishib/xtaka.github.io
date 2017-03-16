function register() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      document.write('Hello ServiceWorker World!');
    })
    .catch((err) => {
      document.write('Oops, not support!');
      document.write(err.message);
    });
  }
}

function install() {
  document.write('SW installed!');
}

(() => {
  const self = this;
  register();
  self.addEventListener('install', install, false);
})();
