import { MarkDownFormatter } from "./src/MarkdownFormatter.js";

/**
 * マークダウンを正しい記法に直し読みやすいものへと修正する
 */
export class MdFmtr extends MarkDownFormatter {
  /**
   * @constructor
   * @param {string} markdownText
   */
  constructor(markdownText) {
    super();
    /**
     * original markdown text
     * @type {string}
     */
    this.orgMdText = markdownText;

    /**
     * fixed markdown text
     * @type {string}
     */
    this.fixedMdText = "";

    this.errors = [];

    // 一番最初に文字列を配列へ
    let mdArray = markdownText.split(/[\n|\r]/);

    // 修正
    mdArray = this.AddSpaceSymbols(mdArray);

    // 期待
    this.FixDoubleBlockquotes(mdArray);

    // 最終的に文字列に直す
    this.fixedMdText = mdArray.join("\n");
  }
}
