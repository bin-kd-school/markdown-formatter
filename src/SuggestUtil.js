export class SuggestUtil {
  /**
   * @constructor
   */
  constructor() {
    /**
     * エラー文の入る配列
     * @type {string}
     */
    this.errors = [];
  }

  /**
   * このクラスの全メソッドを実行する
   * @param {string[]} orgLines - 修正対象のMarkdownテキストを改行で分割した配列
   * @returns {string[]} - エラー分の入った配列
   */
  static all(orgLines) {
    const sMd = new SuggestUtil();

    sMd.#FixDoubleBlockquotes(orgLines);

    return sMd;
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
          this.errors[index] = `2重引用で始まっています`;
        }
        isFirstQuote = false;
      } else if (!quoteRegex.test(line)) {
        isFirstQuote = true;
      }
    });
  }
}
