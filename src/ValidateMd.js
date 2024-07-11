export class ValidateMd {
  /**
   * 行が強調記号で始まっているかチェックします
   * @param {string} line - チェック対象のMarkdownテキストの行
   * @returns {boolean} - 強調記号で始まっている場合はtrue、そうでない場合はfalse
   */
  static isStartWithEmphasis(line) {
    const emphasisRegex = /^\s*[*_]+[^\s*_]+[*_]+/g;
    return emphasisRegex.test(line);
  }

  /**
   * 行が水平線かどうかをチェックします
   * @param {string} line - チェック対象のMarkdownテキストの行
   * @returns {boolean} - 水平線の場合はtrue、そうでない場合はfalse
   */
  static isHorizon(line) {
    const unspacedLine = line.replace(/\s+/g, "");
    const horizonRegex = /^([-*_])\1{2,}$/;
    return horizonRegex.test(unspacedLine);
  }
}
