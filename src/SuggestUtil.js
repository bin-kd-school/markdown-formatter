export class SuggestUtil {
  /**
   * @constructor
   */
  constructor() {
    /**
     * エラー文の入る配列
     * @type {Object<string, string[]>} key: 行の番号, value: 指定行に対するエラー分
     */
    this.errors = {};
  }

  /**
   * このクラスの全メソッドを実行する
   * @param {string[]} orgLines 修正対象のMarkdownテキストを改行で分割した配列
   * @returns {Object<string, string[]>} key: 行の番号, value: 指定行に対するエラー分
   */
  static all(orgLines) {
    const sMd = new SuggestUtil();

    sMd.#FixDoubleBlockquotes(orgLines);
    sMd.#CheckBacktickBalance(orgLines);
    sMd.#CheckDuplicateHeadings(orgLines);

    return sMd.errors;
  }

  #push(index, text) {
    if (this.errors[index]) {
      this.errors[index].push(text);
    } else {
      this.errors[index] = [text];
    }
  }

  /**
   * 引用の先頭行が二重引用で始まっていないか
   * @param {string[]} orgLines - 修正対象のMarkdownテキスト
   * @returns {void}
   */
  #FixDoubleBlockquotes(orgLines) {
    const quoteRegex = /^>+/;
    const outRegex = /^>{2}/;
    let isFirstQuote = true;

    // 各行をチェック
    orgLines.forEach((line, index) => {
      // 行が二重引用以上で始まるか確認
      if (quoteRegex.test(line) && isFirstQuote) {
        if (outRegex.test(line)) {
          // errortextをpush
          this.#push(index, "2重引用ではじまっています");
        }
        isFirstQuote = false;
      } else if (!quoteRegex.test(line)) {
        isFirstQuote = true;
      }
    });
  }

  /**
   * Markdown形式の各行でバッククォートの数が偶数かどうかをチェックし、
   * 奇数の場合はエラーメッセージをpushします。
   * @param {string[]} lines - Markdown形式のテキストの各行を含む配列
   * @returns {void}
   */
  #CheckBacktickBalance(lines) {
    lines.forEach((line, index) => {
      // コードブロックはskip
      if (!/^```/.test(line)) {
        const backtickRegex = /`/g;
        let count = 0;

        // テキスト内のすべてのバッククォートをカウントする
        while (backtickRegex.exec(line) !== null) {
          count++;
        }

        // バッククォートの数が奇数ならばerrorをpush
        if (count % 2 === 1) {
          this.#push(index, "バッククォートが閉じられていない可能性があります");
        }
      }
    });
  }

  /**
   * 見出しの同じ階層に同じタイトルがないかをチェックし、重複する見出しを検出します。
   * @param {string[]} orgLines - Markdown形式のテキストの各行を含む配列
   * @returns {void}
   */
  #CheckDuplicateHeadings(orgLines) {
    /**
     * 見出しを格納するオブジェクト
     * @type {Object<number, Set<string>>}
     */
    const headings = {};

    // 各行の処理
    orgLines.forEach((line, index) => {
      /**
       * 見出しの正規表現マッチ
       * @type {RegExpMatchArray|null}
       */
      const match = line.match(/^(#{1,6})\s*(.*)/);
      if (match) {
        /**
         * 見出しのレベル (1〜6)
         * @type {number}
         */
        const level = match[1].length;

        /**
         * 見出しのタイトル
         * @type {string}
         */
        const title = match[2].trim();

        // レベルごとの見出しを確認
        if (!headings[level]) {
          headings[level] = new Set();
        }

        // 階層が上がった時にその階層未満のオブジェクトをリセット
        let count = level;
        const maxLevel = 6;
        while (++count <= maxLevel) {
          if (headings[count]) headings[count].clear();
        }

        // 複数対応できるように期待文をそのまま格納している
        if (headings[level].has(title)) {
          this.#push(
            index,
            `重複する見出しを見つけました: レベル ${level}, タイトル "${title}"`
          );
        } else {
          headings[level].add(title);
        }
      }
    });
  }
}
