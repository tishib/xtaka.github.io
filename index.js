var dataURL = 'https://api.github.com/events';
var cacheDelayInput = document.getElementById('cacheDelay');
var cacheFailInput = document.getElementById('cacheFail');
var networkDelayInput = document.getElementById('networkDelay');
var networkFailInput = document.getElementById('networkFail');
var cacheStatus = document.getElementById('cacheStatus');
var networkStatus = document.getElementById('networkStatus');
var getDataButton = document.getElementById('getDataButton');
var dataOutput = document.getElementById('data');
var getCacheKeysButton = document.getElementById('getCacheKeysButton');

var cacheName = 'cache-then-network'

// ネットワークの方が早ければそのデータを使う
var isGotNetworkData = false;

// 取得経過時間 
var networkGetStartTime;
var cacheGetStartTiem;

// Reset UI text value and some flags
function reset() {
  dataOutput.textContent = '';
  cacheStatus.textContent = '';
  networkStatus.textContent = '';
  isGotNetworkData = false;
}

function disableUI() {
  getDataButton.disabled = true;
  cacheDelayInput.disabled = true;
  cacheFailInput.disabled = true;
  networkDelayInput.disabled = true;
  networkFailInput.disabled = true;
  reset();
}

function updatePage(data) {
  dataOutput.textContent = 'User ' + data[0].actor.login +
  ' modified repo ' + data[0].repo.name;
}

function handleFetchCompletion(response) {
  var shouldNetworkError = networkFailInput.checked;
  if (shouldNetworkError) {
    throw new Error('Network error');
  }

  var resClone = response.clone();
  caches.open(cacheName).then(function(cache) {
    cache.put(dataURL, resClone);
  });

  response.json().then(function(data) {
    updatePage(data);
    isGotNetworkData = true;
  });
}

function handleCacheFetchCompletion(response) {
  var shouldCacheError = cacheFailInput.checked;
  if (shouldCacheError || !response) {
    throw new Error('Cache miss');
  }

  response.json().then(function(data) {
    if (!isGotNetworkData) {
      updatePage(data);
    }
  });
}

function enableUI() {
  getDataButton.disabled = false;
  cacheDelayInput.disabled = false;
  cacheFailInput.disabled = false;
  networkDelayInput.disabled = false;
  networkFailInput.disabled = false;
}

getDataButton.addEventListener('click', function handleClick() {
  disableUI();

  networkStatus.textContent = 'Getting...';
  networkGetStartTime = Date.now();

  var cacheBuster = Date.now();
  var networkFetch = fetch(dataURL + '?cacheBuster=' + cacheBuster, {
      mode: 'cors',
      cache: 'no-cache',
    })
    .then(function(response) {
      var networkDelay = networkDelayInput.value || 0;

      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          try {
            handleFetchCompletion(response);
            resolve();
          } catch (err) {
            reject(err);
          }
        }, networkDelay);
      });
    })
    .then(function() {
      var now = Date.now();
      var elapsed = now - networkGetStartTime;
      networkStatus.textContent = 'Success after ' + elapsed + 'ms';
    })
    .catch(function(err) {
      var now = Date.now();
      var elapsed = now - networkGetStartTime;
      networkStatus.textContent = err + ' after ' + elapsed + 'ms';
    });

    // Get from cached data
    cacheStatus.textContent = 'Getting...';
    cacheGetStartTiem = Date.now();
    var cacheFetch = caches.open(cacheName).then(function(cache) {
      return cache.match(dataURL).then(function(response) {
        var cacheDelay = cacheDelayInput.value || 0;

        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            try {
              handleCacheFetchCompletion(response);
              resolve();
            } catch (err) {
              reject(err);
            }
          }, cacheDelay);
        });
      })
      .then(function() {
        var now = Date.now();
        var elapsed = now - cacheGetStartTiem;
        cacheStatus.textContent = 'Success after ' + elapsed + 'ms';
      })
      .catch(function(err) {
        var now = Date.now();
        var elapsed = now - cacheGetStartTiem;
        cacheStatus.textContent = err + ' after ' + elapsed + 'ms';
      });
    });

    Promise.all([networkFetch, cacheFetch]).then(enableUI);
});

getCacheKeysButton.addEventListener('click', function handleClick() {
  caches.open(cacheName).then(function(cache) {
    cache.keys().then(function(keys) {
      console.log(keys);
    });
  });
});