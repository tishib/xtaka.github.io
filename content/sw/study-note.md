- スーパーリロードには非対応
- 登録する時は、origin+target path
```
navigator.serviceWorker.register('/sw/cache-onley/sw.js');
```
- リロード時、index.htmlとかindex.jsは、ブラウザのキャッシュから取得してるっぽい(@chrome)、swは無関係。
- fetch(request)でネットワークから取得
- リクエスト/レスポンスはStreamだから、基本１つだけ。event.request.clone()で増やす。
- 新しいSWは、古いSWが死ぬまで「waiting」（すぐ反映されない）
