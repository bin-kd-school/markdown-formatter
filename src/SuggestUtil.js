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
    sMd.#CheckHeadingForContent(orgLines);
    sMd.#checkLineLength80(orgLines);
    sMd.#IsMarkdownBalanced(orgLines);

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
   * 一行の文字数が80文字以内かを確認します
   * @param {string[]} lines - テキストの各行を含む配列
   * @returns {void}
   */
  #checkLineLength80(lines) {
    lines.forEach((line, index) => {
      if (line.length > 80) this.#push(index, "Exceeds 80 characters");
    });
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
          this.#push(index, "Starts with double quotation marks");
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
      if (!/^`{3,}/.test(line)) {
        const backtickRegex = /`/g;
        let count = 0;

        // テキスト内のすべてのバッククォートをカウントする
        while (backtickRegex.exec(line) !== null) {
          count++;
        }

        // バッククォートの数が奇数ならばerrorをpush
        if (count % 2 === 1) {
          this.#push(index, "Backticks might not be properly closed");
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
            `Duplicate heading: level ${level}, title "${title}"`
          );
        } else {
          headings[level].add(title);
        }
      }
    });
  }

  /**
   * 本文の有無を確認
   * @param {string[]} orgLines - Markdown形式のテキストの各行を含む配列
   * @returns {void}
   */
  #CheckHeadingForContent(orgLines) {
    // Split the markdown text into lines
    let currentHeading = null;

    // Iterate through each line
    for (let i = 0; i < orgLines.length; i++) {
      const line = orgLines[i].trim();

      // Check if the line is a heading
      const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        // 本文がない場合の処理
        if (currentHeading && currentHeading.level >= headingMatch[1].length) {
          this.#push(
            currentHeading.line,
            `No body text: level ${currentHeading.level}, title "${currentHeading.title}"`
          );
        }
        // Start tracking the new heading
        currentHeading = {
          level: headingMatch[1].length,
          line: i,
          title: headingMatch[2],
        };
      } else if (currentHeading) {
        // Check if the current line is not empty, indicating there's content after the heading
        if (line) {
          currentHeading = null;
        }
      }
    }
  }

  /**
   * マークダウンの強調タグ（* および _）が同じ数で閉じられているかどうかを確認する
   * @param {string[]} orgLines - 検査対象のMarkdownテキストの配列
   * @returns {void}
   */
  #IsMarkdownBalanced(orgLines) {
    const patterns = [{ Regex: /\*+/g }, { Regex: /_+/g }];

    orgLines.forEach((line, index) => {
      patterns.forEach(({ Regex }) => {
        let match;
        let stack = [];

        // 各パターンの検索を先頭から開始
        Regex.lastIndex = 0;

        while ((match = Regex.exec(line)) !== null) {
          if (stack.length === 0 || stack[stack.length - 1] !== match[0]) {
            // 開始タグをスタックに追加
            stack.push(match[0]);
          } else {
            // 終了タグでスタックからポップ
            stack.pop();
          }
        }

        // スタックが空でない場合、バランスしていない
        if (stack.length !== 0) {
          this.#push(index, "Emphasis tags are not closed properly");
        }
      });
    });
  }
}
