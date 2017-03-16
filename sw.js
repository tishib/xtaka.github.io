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

window.onload = () => {
  const self = this;
  self.addEventListener('install', install);
  register();
};
