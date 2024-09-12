# markdown-formatter

A library to proofread markdown

# 使用法

1. モジュール用のディレクトリへクローン
   ```
   git clone https://github.com/bin-kd-school/markdown-formatter.git
   ```
2. モジュールを使用するファイルにて`import`

   ```js
   import { MdFmtr } from "./modules/markdown-formatter/index.mjs";
   ```

3. 引数に校正したいマークダウンの文章を入れる
   ```js
   const mdfmtr = new MdFmtr(argStr());
   // 引数に渡された元の文章
   console.log(mdfmtr.orgMdText);
   // 校正された文章
   console.log(mdfmtr.fixedMdText);
   // 修正が期待される個所のエラー文
   console.log(mdfmtr.errors);
   ```

> 通常のjsファイルでは`import`をただ記入してもエラーが出るので、
>
> https://qiita.com/Philosophistoria/items/1df484e658c019b56ea9
>
> 以上のサイトを参考に`import`してください

```

# 仕様

## 修正

- 見出しやリストなど記法の分かれ目や見出しとそこに属する本文との境に改行を挿入する
- 番号付きリストの番号を連番確認及びソートする
- 強調をアスタリスクに統一する (閉じられていれば実行)
- 箇条書きリストの記号をハイフンに統一
- 水平線をハイフンに統一
- md記法で使われる記号の後にスペースを一つ挿入
- 箇条書きリストと番号付きリストのインデントを揃える

## 修正が期待される個所の出力

- 一行の文字数が80文字以内かを確認
- 引用の先頭行が二重引用で始まっていないか
- バッククォートが適切に閉じられているか
- 見出しの同じ階層に同じタイトルがないかをチェックし、重複する見出しを検出
- 本文の有無を確認
- 強調タグ（\* および \_）が同じ数で閉じられているかどうかを確認
```
