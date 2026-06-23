# 課金設定メモ

## 方式

まずは Stripe Payment Links で始める想定です。

- 奉納料: 980円
- 商品名: ミコトからの手紙 / 封じられた六つの書
- 決済後の戻り先: `https://mikoto-letter-share.vercel.app/thank-you.html`
- キャンセル時の戻り先: `https://mikoto-letter-share.vercel.app/`

## 設定手順

1. Stripeで商品「封じられた六つの書」を作る
2. 価格を `980 JPY` にする
3. Payment Linkを作る
4. 決済完了後のリダイレクト先に `https://mikoto-letter-share.vercel.app/thank-you.html` を指定する
5. 発行されたURLを `config.js` の `paymentLink` に貼る

```js
window.MIKOTO_CONFIG = {
  paymentLink: "https://buy.stripe.com/..."
};
```

## 次の段階

本格運用では、Stripe Checkout SessionとWebhookで支払い済み確認を行い、支払い済みの人だけに六つの書を表示します。
