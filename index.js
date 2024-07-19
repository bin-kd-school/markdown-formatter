import { ProofreadUtil } from "./src/ProofreadUtil.js";
import { SuggestUtil } from "./src/SuggestUtil.js";

/**
 * マークダウンを正しい記法に直し読みやすいものへと修正する
 */
export class MdFmtr {
  /**
   * @constructor
   * @param {string} markdownText
   */
  constructor(markdownText) {
    /**
     * 元のマークダウンテキスト
     * @type {string}
     */
    this.orgMdText = markdownText;

    // 一番最初に文字列を配列へ
    let mdArray = markdownText.split(/[\n|\r]/);

    // 修正
    mdArray = ProofreadUtil.all(mdArray);
    // 最終的に文字列に直す
    /**
     * 修正されたマークダウンテキスト
     * @type {string}
     */
    this.fixedMdText = mdArray.join("\n");

    // 期待
    /**
     * @type {Object<string, string[]>}
     * @key {string} 行の番号
     * @value {string[]} 指定行に対するエラー分
     */
    this.errors = SuggestUtil.all(mdArray);
  }
}
