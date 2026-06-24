# Windows側からの同期メモ（2026-06-24）

シンちゃん（Mac/Claude Code）向け。Macのローカルがこのpush前の状態のままなら、まず `git pull` してください。

## 今回起きたこと

- Windows側で `js/` 分割構成への移行＋デザイン刷新（アプリ名「ミコトからの手紙」→「夜見の響き」、ヒーロー垂れ幕デザイン、紫紺カラー等）を実施
- Mac側がpushしていた旧バージョン（単一 `app.js`、旧デザイン）を上書きする形でpush済み
- Vercel本番 (`mikoto-letter-share.vercel.app`) もWindows側から `vercel --prod` で反映済み

## 構造変更

```
旧: app.js（単一ファイル）
新: js/
    ├── config.js   Stripe等の設定（gitignore対象、ローカルで作成必要）
    ├── data.js     診断カテゴリ・全文言
    ├── engine.js   診断ロジック（おみくじ式）
    ├── render.js   画面反映
    ├── payment.js  決済リンク処理
    └── app.js      フォームイベント・初期化
```

`index.html` の `<script>` タグも `js/*.js` を順番に読む形に変更済み。

## pull後にやること

1. `config.js` の引っ越し — Macに既存の `config.js`（paymentLink等）があれば、内容を `js/config.js` に移して、ルートの古い `config.js` は削除
2. ローカルで `index.html` を開いて動作確認

## 今後の運用ルール

- 作業前: `git pull`
- 作業後: `git add -A && git commit -m "..." && git push`
- デプロイは **pushした側が `vercel --prod` する**（二重デプロイ防止）
- 設計の詳細・文言方針・カラー定義は同梱の `HANDOFF.md` 参照
