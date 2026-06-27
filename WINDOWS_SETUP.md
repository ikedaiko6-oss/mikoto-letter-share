# Windows側のセットアップ（GitHub同期）

> Codex/エージェント向け: このファイルの指示をそのまま実行してOKです。
> 重要: 「今の作業フォルダ」（最新の編集内容が入っているフォルダ）を **上書き・削除・移動しないこと**。
> 作業はすべて、手順2で新しく作る別フォルダ（clone先）の中で行うこと。
> 「今の作業フォルダ」のパスがどこか不明な場合は、作業を始める前に必ずユーザーに確認すること。

Mac側はすでにGitHubリポジトリ化済み。
Windows側でも同じリポジトリをcloneして、git経由で双方向に同期する。

- GitHub: https://github.com/ikedaiko6-oss/mikoto-letter-share （公開リポジトリ）
- デプロイ先: https://mikoto-letter-share.vercel.app

## 1. Git for Windows をインストール

https://git-scm.com/download/win からダウンロードしてインストール（デフォルト設定でOK）。

## 2. リポジトリをクローン

既存のローカル作業フォルダとは別の場所に、新規でクローンする。

```
git clone https://github.com/ikedaiko6-oss/mikoto-letter-share.git
cd mikoto-letter-share
```

## 3. 今のローカル版の最新ファイルを上書きコピー

`index.html` / `styles.css` / `app.js` など、今ローカルで編集している最新版を
クローンしたフォルダに上書きコピーする。

## 4. config.js を作成

`config.js` は `.gitignore` で除外されているため、gitには含まれていない。手動で作成する。

```js
window.MIKOTO_CONFIG = {
  paymentLink: ""
};
```

## 5. 初回コミット & push

```
git add -A
git commit -m "Windows側の最新版を反映"
git push
```

push時に一度だけGitHubアカウントでの認証が必要（ブラウザでログイン画面が出る）。
`ikedaiko6-oss` アカウントでログインする。

## 以降の運用

- **作業を始める前**: `git pull`
- **作業が終わったら**:
  ```
  git add -A
  git commit -m "変更内容"
  git push
  ```

Mac側でも同じく `git pull` すれば最新を取り込める。
両方から直接pushして食い違いが出た場合は、`git pull` してから再度pushすれば自動で統合される（コンフリクトが出た場合は該当ファイルを手動で確認）。
