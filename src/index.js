/**
 * マークダウンを正しい記法に直し読みやすいものへと修正する
 */
class MdFmtr {
  constructor(markdownText) {
    this.orgMdText = markdownText;
    this.fixedMdText = markdownText;
    this.errors = [];

    // 修正
    this.fixedMdText = this.AddSpaceSymbols(this.fixedMdText);

    // 期待
    this.FixDoubleBlockquotes(this.fixedMdText);

    console.log(this.fixedMdText);
    console.log(this.errors);
    console.log(this.errors[0]);
  }

  /**
   * いきなり二重引用で始まっていないか
   * @param {string[]} orgLines - 修正対象のMarkdownテキスト
   * @returns {void}
   */
  FixDoubleBlockquotes(orgLines) {
    const quoteRegex = /^>+/;
    const outRegex = /^>{2}/;
    let isFirstQuote = true;

    // 各行をチェック

    orgLines.forEach((line, index) => {
      // 行が二重引用以上で始まるか確認
      if (line.match(quoteRegex) && isFirstQuote) {
        if (line.match(outRegex)) {
          // errortextをpush
          this.errors[index] = `2重引用で始まっています`;
          console.log(index, line);
        }
        isFirstQuote = false;
      } else if (!line.match(quoteRegex)) {
        isFirstQuote = true;
      }
    });
  }

  /**
   * md記法で使われる記号の後にスペースを一つ挿入
   * @param {string[]} orgLines - 修正対象のMarkdownテキスト
   * @returns {string[]} 修正後のMarkdownテキスト
   */
  AddSpaceSymbols(orgLines) {
    /**
     * regex: 正規表現パターン
     * replacement: 置換用の文字列
     * @type {{regex: pattern, replacement: string}}
     */
    const patterns = [
      // 中間の( *)は既にスペースが入っていることを考慮している
      { regex: /^([-*+]{2,})( *)(\S)/, replacement: "$1$3" }, // 2個以上の場合は強調か水平線になるのでskip
      // 箇条書きリストと番号付きリストは
      // インデントを考慮する必要があるので
      // 任意の数の空白を最初に入れる
      { regex: /^( *)([-*+]{1})( *)(\S)/, replacement: "$1$2 $4" }, // 箇条書き
      { regex: /^( *)(\d+\.)( *)(\S)/, replacement: "$1$2 $4" }, // 番号付きリスト
      { regex: /^(#{1,6})( *)(\S)/, replacement: "$1 $3" }, //見出し
      { regex: /^(>+)( *)(\S)/, replacement: "$1 $3" }, // 引用
    ];

    return orgLines.map((line) => {
      for (let pattern of patterns) {
        // 2文字以上の場合
        if (line.length > 1 && line.match(pattern.regex)) {
          line = line.replace(pattern.regex, pattern.replacement);
          // 処理を中断し、次の行へ
          break;
        }
      }
      return line;
    });
  }
}
