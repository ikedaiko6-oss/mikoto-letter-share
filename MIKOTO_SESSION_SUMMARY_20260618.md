# ミコトからの手紙 — セッションまとめ 2026-06-18

## プロジェクト概要

**アプリ名**: ミコトからの手紙  
**世界観**: 夜見神社 御言葉の社 / 神社占い系 WebApp  
**デプロイ**: https://mikoto-letter-share.vercel.app  
**ローカルパス**: `/Users/m3macbookairpapa/Documents/02_開発プロジェクト/mikoto-letter-share/`  
**ナギちゃん渡し用ZIP**: `mikoto-letter-share-20260618.zip` (302KB)

---

## 今日やったこと

### 1. be-yourself カテゴリ調査

カテゴリ `be-yourself`（自分らしく生きたい）の内容を確認。  
`app.js` の lines 111–123 にある既存コンテンツは精度が高く、`letter` フィールドだけ改善余地あり。

**推奨改善（未実装）**:
```
「妻として、母として、娘として、社員として──
  いつも誰かの期待に応えようとしてきたあなたへ。
  今日だけは、あなた自身の番です。」
```

---

### 2. 相性版→相談版 確認

相性版（相手の呼び名・生年月日フォーム）は **実ファイルには存在しない**。  
前回のモックアップ内にだけあったもの。  
実ファイル（`index.html`）はすでに相談版。相性版は保留のまま。

---

### 3. デザイン刷新 — 神社パレット適用

`styles.css` に朱・金・藍・和紙パレットを適用済み。

#### カラー変数

```css
:root {
  --vermillion: #c03a18;      /* 朱色 鳥居レッド */
  --vermillion-soft: #d44e2a;
  --gold: #c4941c;
  --gold-light: #d8a820;
  --dark-bg: #172447;         /* 深藍 社殿の闇 */
  --indigo: #172447;
  --sealed: #0f1a36;
  --bg: #faf4e8;              /* 和紙 washi */
  --muted: #8a7b6b;
}
```

#### 主な変更点

| 要素 | 変更内容 |
|------|---------|
| `.shrine-bar` | 6px 朱色の帯 |
| `.shrine-hero` | 深藍 + 格子紋様（金色グリッド 20px） |
| `.emblem-circle` | 朱色ボーダー + 朱色背景(10%) |
| `.shrine-panel label` | 朱色テキスト |
| `input:focus` | 朱色アンダーライン |
| `.submit-btn` | 朱色ベース + ::before/::after 内側ライン |
| `.result-bg` | 深藍 + 格子紋様 |
| `.sealed-books` | 最暗藍 + 格子紋様 |

#### 格子紋様（社殿・封印エリア共通）

```css
::before {
  background-image:
    linear-gradient(rgba(196,148,28,.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(196,148,28,.06) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

---

### 4. 封印テキスト「見え隠れ」効果

`.sealed-scroll p` に実装済み:

```css
.sealed-books .sealed-scroll p {
  filter: blur(1.4px);
  mask-image: repeating-linear-gradient(
    -18deg,
    rgba(0,0,0,1) 0px, rgba(0,0,0,1) 14px,
    rgba(0,0,0,0.08) 16px, rgba(0,0,0,0.08) 24px,
    rgba(0,0,0,0.75) 26px, rgba(0,0,0,0.75) 40px,
    rgba(0,0,0,0.05) 42px, rgba(0,0,0,0.05) 50px,
    rgba(0,0,0,0.9) 52px, rgba(0,0,0,0.9) 66px
  );
}
.sealed-books .sealed-scroll span {
  opacity: 0.72;
  filter: blur(0.4px);
}
```

---

### 5. 金額表示をさりげなく

`.premium-hero strong` と `.teaser-head > span` を修正済み:

```css
/* Before: 34px 赤 ベタ表示 */
/* After: */
.premium-hero strong {
  color: var(--muted);
  font-size: 18px;
  font-weight: 400;
}
.teaser-head > span {
  background: transparent;
  color: rgba(196,148,28,0.55);
  font-size: 11px;
  font-weight: 400;
}
```

---

## 未実装（次にやること）

### A. 「有料版準備中」テキスト変更

`index.html` line 279 の `checkout-status`:

```html
<!-- 現在 -->
<small id="checkout-status">封じを解く入口へ進みます。決済後、この御書へ戻れます。</small>

<!-- 推奨 -->
<small id="checkout-status">六つの書は近く封が解かれます</small>
```

### B. シェアボタン強化

X/Twitter 投稿文に御書の一節を pre-fill する。  
例:
```
「あなたはわがままになりたいのではありません」
─ 夜見ミコトより

自分の問いをあずけてみた → [URL]
```

### C. app.js be-yourself の letter 改善

`app.js` line 111–123 の `letter` フィールドを上記推奨文に書き換え。

---

## マーケティング戦略メモ

### フェーズ1（今すぐ）: 仕込み

1. **奥さんに本音で使ってもらい、そのままXに上げてもらう**（一番強い）
2. **作った本人が「使ったら刺さった」投稿** — 製作者が当てられた話は信頼度高
3. **夜見ミコトのXアカウント作成** → 毎日「今日の御文」一文を投稿

### フェーズ2（1〜2週間後）: 拡散

- ハッシュタグ: `#ミコトからの手紙` `#神社占い` `#今日の御書`
- noteに「作った理由」を書く（感情ストーリー）
- 占い系インフルエンサーへのDM（1日3人まで）

### 自作自演について

| OK | NG |
|----|-----|
| 作り手として自分の体験を投稿 | 別アカウントで「使いました！」 |
| 家族・友人に本音の感想を投稿してもらう | 複数アカウントで同URLを同時拡散 |
| ミコトキャラとして「今日の御文」を投稿 | 作りすぎた絶賛レビュー |

---

## ファイル構成（現状）

```
mikoto-letter-share/
├── index.html       # 289行 相談版フォーム（変更なし）
├── styles.css       # 2082行 神社パレット適用済み
├── app.js           # 1102行 27+カテゴリ（be-yourselfはline 111）
├── config.js        # Stripe等の設定
└── assets/
    ├── washi-texture.svg
    ├── goshuin-stamp.svg
    └── hanko-yomi.png
```

---

## 世界観用語対応表

| 普通の言葉 | ミコト世界の言葉 |
|-----------|----------------|
| 診断する | 御書を納める |
| 結果 | 御文 |
| 購入する | 封じを解く |
| 有料コンテンツ | 六つの書 |
| 占い師 | 夜見ミコト（問いを預かる巫女） |
| 神社名 | 夜見神社 御言葉の社 |
