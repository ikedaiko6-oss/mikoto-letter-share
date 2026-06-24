# 夜見の響き — ナギちゃん引き継ぎメモ

## プロジェクト概要
占いに見せかけた「心の診断ツール」。ユーザーが悩みを入力すると、その本質を言語化した言葉が返ってくる仕組み。
ターゲット：スピリチュアル界隈の入り口層（半信半疑でやってみる人が刺さる設計）。

---

## ファイル構成

```
mikoto-letter-share_proto_20260618/
├── index.html      メイン画面
├── thank-you.html  決済完了後のページ（仮置き）
├── styles.css      全スタイル
├── js/
│   ├── config.js   Stripe等の設定（空）
│   ├── data.js     診断カテゴリ・御書パーツ・全文言
│   ├── engine.js   診断ロジック
│   ├── render.js   画面反映・結果画像保存
│   ├── payment.js  決済リンク処理
│   └── app.js      フォームイベント・画面初期化
└── assets/         画像・装飾素材
```

---

## 設計思想（裏コンセプト）

カタカムナの「現象界 / 潜象界」が骨格。
夜見神社 = 潜象界からの声 という設定で、ユーザーには「占い」として見せる。
やったら心に刺さる → そこが入り口。

---

## 完成済み

- ヒーローデザイン：垂れ幕（紫紺）＋筆文字ゴースト（占）
- コピー：「声に出せなかった問いが、言葉になって返ってきます。」方向
- 診断データ：29カテゴリ × テーマ8種（js/data.js）
- 診断ロジック：おみくじ式の組み合わせ生成（js/engine.js）
- 全文言：oracle voice にチューニング済み
- プレミアム：六つの書グリッド（UI のみ）
- Google Font：Yuji Boku（筆文字フォールバック）

---

## ナギちゃんの担当

### 1. 決済フロー（Stripe）
- `js/config.js` に Stripe 決済リンクを入れる
- `.premium-trigger` ボタンのクリックで Stripe Checkout へ遷移
- 完了後 `thank-you.html` にリダイレクト

### 2. thank-you.html — 六つの書を表示
- 決済完了後、診断結果の続き（`concern.locked` 等）を表示
- `sessionStorage` か URL パラメータで診断データを渡す想定

### 3. その他
- OGP / meta タグ（シェア用）
- モバイル実機確認
- `denim_b64.txt` は不要なので削除してOK

---

## 主要カラー

| 変数 | 値 | 用途 |
|------|----|------|
| `--dark-bg` | `#2e2070` | 紫紺・ヒーロー背景 |
| `--sealed` | `#231860` | 封印セクション背景 |
| `--vermillion` | `#c03a18` | アクセント朱色 |
| `--gold` | `#c4941c` | アクセント金色 |
| `--washi` | `#f2ede3` | 和紙クリーム |

---

## JS構造（簡易）

```
js/data.js
concerns{}        29カテゴリ分の診断文言
  .core           深層洞察（#deep-insight）
  .line           フォーカス（#result-focus）
  .letter         ミコトの手紙（#mikoto-letter）
  .advice         アドバイス（#result-advice）
  .step           今日のつとめ（#next-step）
  .locked         封印プレビュー（#locked-preview）

concernOptionsByTheme{}   テーマ→カテゴリのマッピング
insights{}                5テーマ×3パターンの洞察文
worrySignals[]            心配サイン（6種）
omikujiParts{}            御書名・灯り・文の揺らぎパーツ

js/engine.js
buildOmikuji()            名前・生年月日・入力から御書パーツを決定
varyStep()                今日そっと置くことをテーマ別に分岐

js/render.js
renderResult()            画面へ反映

js/payment.js
initPaymentTriggers()     決済リンクへ遷移 / 未設定時の準備中表示

js/app.js
updateConcernOptions()    テーマ選択に応じて縁の選択肢を更新
```

---

## 注意事項

- JSはシングルクォート/ダブルクォートを通常文字で扱うこと（カーリークォートで構文エラーになる）
- バックアップ：`mikoto-letter-share_backup_current_20260618_0550/` → 触らない
