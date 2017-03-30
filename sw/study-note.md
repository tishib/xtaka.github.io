- スーパーリロードには非対応
- 登録する時は、origin+target path
```
navigator.serviceWorker.register('/sw/cache-onley/sw.js');
```
- リロード時、index.htmlとかindex.jsは、ブラウザのキャッシュから取得してるっぽい(@chrome)、swは無関係。
