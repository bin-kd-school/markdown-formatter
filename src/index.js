class MdFmtr {
  // 6/27  追加
  // md記法で使われる記号の後にスペースを一つ挿入
  AddSpaceSymbols(orgText) {
    // 正規表現パターンを配列に定義
    const patterns = [
      { regex: /^([-*+]{2})( *)(\S)/, replacement: "$1$3" }, // 2個以上の場合は協調になるのでskip
      // 箇条書きリストと番号付きリストは
      // 「インデント」と「既にスペースが入っている」場合を考慮する必要があるので
      // 任意の数の空白を適宜入れる必要がある
      { regex: /^( *)([-*+]{1})( *)(\S)/, replacement: "$1$2 $4" }, // 箇条書き
      { regex: /^( *)(\d+\.)( *)(\S)/, replacement: "$1$2 $4" }, // 番号付きリスト
      { regex: /^(#{1,6})( *)(\S)/, replacement: "$1 $3" }, //見出し
      { regex: /^(>+)( *)(\S)/, replacement: "$1 $3" }, // 引用
    ];

    const chgText = orgText.map((text) => {
      for (let pattern of patterns) {
        // 2文字以上の場合
        if (text.length > 1 && text.match(pattern.regex)) {
          text = text.replace(pattern.regex, pattern.replacement);
          // 処理を中断し、次の行へ
          break;
        }
      }
      return text;
    });

    return chgText;
  }
}
