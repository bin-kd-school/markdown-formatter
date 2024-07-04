export class ProofreadUtil {
  /**
   * このクラスの全メソッドを実行する
   * @param {string[]} orgLines - 修正対象のMarkdownテキストを改行で分割した配列
   * @returns {string[]} - 引数のMarkdownを校正したもの
   */
  static all(orgLines) {
    const pMd = new ProofreadUtil();

    orgLines = pMd.#AdjustListIndentation(orgLines);
    orgLines = pMd.#AddSpaceSymbols(orgLines);
    orgLines = pMd.#unifyBulletListSymbols(orgLines);

    return orgLines;
  }

  /**
   * 箇条書きリストと番号付きリストのインデントを揃える
   * @param {string[]} orgLines - 修正対象のMarkdownテキスト
   * @returns {string[]} 修正後のMarkdownテキスト
   */
  #AdjustListIndentation(orgLines) {
    let currentIndentLevel = 0;
    // 続いているリストの比較済みの行のスペース数
    // indexの若いほうから直近の行となっている
    let spacesStack = [];

    return orgLines.map((line) => {
      const trimedLine = line.trimStart();
      const leadingSpaces = line.length - trimedLine.length;

      // 改行のみと強調や水平線の場合は現状のまま返す
      if (trimedLine.length == 0 || /^[*+-]{2,}/.test(trimedLine)) {
        return trimedLine;
      }

      if (/^\d+\./.test(trimedLine) || /^[*+-]/.test(trimedLine)) {
        // 比較対象の行の一個前に比較した行のスペース数
        let oldPreSpace = null;
        for (const preSpace of spacesStack) {
          // 比較対象の行よりもスペースが2個多ければ
          // indentレベルup
          if (leadingSpaces - preSpace >= 2) {
            currentIndentLevel += 1;
            break;
            // スペースが十分にない場合の1行目 または
            // 一個前に比較した行よりもスペースが2個多ければ
          } else if (oldPreSpace == null || oldPreSpace - preSpace >= 2) {
            currentIndentLevel = currentIndentLevel
              ? currentIndentLevel - 1
              : currentIndentLevel;
          }
          oldPreSpace = preSpace;
        }
        spacesStack.unshift(leadingSpaces);
      } else {
        currentIndentLevel = 0;
        spacesStack = [];
      }

      return " ".repeat(currentIndentLevel * 2) + trimedLine;
    });
  }

  /**
   * md記法で使われる記号の後にスペースを一つ挿入
   * @param {string[]} orgLines - 修正対象のMarkdownテキスト
   * @returns {string[]} 修正後のMarkdownテキスト
   */
  #AddSpaceSymbols(orgLines) {
    /**
     * 正規表現パターンと置換方法のリスト
     * @type {Array<{regex: RegExp, replacement: string}>}
     */
    /*
    const patterns = [
      // 中間の( *)は既にスペースが入っていることを考慮している
      { regex: /^([-*+]{2,})\s*(\S)/, replacement: "$1$2" }, // 2個以上の場合は強調か水平線になるのでskip
      // 箇条書きリストと番号付きリストは
      // インデントを考慮する必要があるので
      // 任意の数の空白を最初に入れる
      { regex: /^( *)([-*+]{1})\s*(\S)/, replacement: "$1$2 $3" }, // 箇条書き
      { regex: /^( *)(\d+\.)\s*(\S)/, replacement: "$1$2 $3" }, // 番号付きリスト
      { regex: /^(#{1,6})\s*(\S)/, replacement: "$1 $2" }, //見出し
      { regex: /^(>+)\s*(\S)/, replacement: "$1 $2" }, // 引用
    ];
    */

    const patterns = [
      // 中間の( *)は既にスペースが入っていることを考慮している
      { regex: /^([-*+]{2,})(\s*)/, replacement: "$1$2" }, // 2個以上の場合は強調か水平線になるのでskip
      // 箇条書きリストと番号付きリストは
      // インデントを考慮する必要があるので
      // 任意の数の空白を最初に入れる
      { regex: /^( *)([-*+]{1})\s*/, replacement: "$1$2 " }, // 箇条書き
      { regex: /^( *)(\d+\.)\s*/, replacement: "$1$2 " }, // 番号付きリスト
      { regex: /^(#{1,6})\s*/, replacement: "$1 " }, //見出し
      { regex: /^(>+)\s*/, replacement: "$1 " }, // 引用
    ];

    return orgLines.map((line) => {
      for (let pattern of patterns) {
        // 2文字以上の場合
        if (line.length > 1 && pattern.regex.test(line)) {
          line = line.replace(pattern.regex, pattern.replacement);
          // 処理を中断し、次の行へ
          break;
        }
      }
      return line;
    });
  }

  /**
   * Markdownテキストの箇条書きリストの記号をハイフンに統一します。
   * @param {string[]} orgLines - Markdown形式のテキストの各行を含む配列
   * @returns {string[]} - 記号が統一されたMarkdown形式のテキストの各行を含む配列
   */
  #unifyBulletListSymbols(orgLines) {
    return orgLines.map((line) => {
      if (/^\*{2,}/.test(line.replace(/\s/, ""))) return line;
      return line.replace(/^(\s*)([*+])(\s+)/, "$1-$3");
    });
  }
}
