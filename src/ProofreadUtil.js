import { ValidateMd } from "./ValidateMd.js";

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
    orgLines = pMd.#UnifyHorizontalLines(orgLines);
    orgLines = pMd.#UnifyBulletListSymbols(orgLines);
    orgLines = pMd.#UnifyAsterisks(orgLines);
    orgLines = pMd.#AdjustOrderedListNumbers(orgLines);
    orgLines = pMd.#AddLineBreaks(orgLines);

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
      if (
        trimedLine.length == 0 ||
        ValidateMd.isStartWithEmphasis(line) ||
        ValidateMd.isHorizon(line)
      ) {
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
    const patterns = [
      // 箇条書きリストと番号付きリストは
      // インデントを考慮する必要があるので
      // 任意の数の空白を最初に入れる
      { regex: /^(\s*)([-*+]{1})\s*/, replacement: "$1$2 " }, // 箇条書き
      { regex: /^(\s*)(\d+\.)\s*/, replacement: "$1$2 " }, // 番号付きリスト
      { regex: /^(#{1,6})\s*/, replacement: "$1 " }, //見出し
      { regex: /^(>+)\s*/, replacement: "$1 " }, // 引用
    ];

    return orgLines.map((line) => {
      if (
        !ValidateMd.isStartWithEmphasis(line) &&
        !ValidateMd.isHorizon(line)
      ) {
        for (let pattern of patterns) {
          // 2文字以上の場合
          if (line.length > 1 && pattern.regex.test(line)) {
            line = line.replace(pattern.regex, pattern.replacement);
            // 処理を中断し、次の行へ
            break;
          }
        }
      }
      return line;
    });
  }

  /**
   * Markdownの水平線をハイフンに統一します
   * @param {string[]} orgLines - Markdown形式のテキストの各行を含む配列
   * @returns {string[]} - 水平線がハイフンで統一されたMarkdown形式のテキストの各行を含む配列
   */
  #UnifyHorizontalLines(orgLines) {
    return orgLines.map((line) => {
      // 水平線をチェックする正規表現
      if (ValidateMd.isHorizon(line)) {
        // ハイフンで水平線を作成
        return "---";
      }
      return line;
    });
  }

  /**
   * Markdownテキストの箇条書きリストの記号をハイフンに統一
   * @param {string[]} orgLines - Markdown形式のテキストの各行を含む配列
   * @returns {string[]} - 記号が統一されたMarkdown形式のテキストの各行を含む配列
   */
  #UnifyBulletListSymbols(orgLines) {
    return orgLines.map((line) => {
      if (ValidateMd.isStartWithEmphasis(line)) return line;
      return line.replace(/^(\s*)([*+])(\s+)/, "$1-$3");
    });
  }

  /**
   * 強調を `*` に統一する (閉じられていれば実行)
   * @param {string} orgLines - 処理対象のMarkdownテキスト
   * @returns {string} - `*` に統一されたMarkdownテキスト
   */
  #UnifyAsterisks(orgLines) {
    const regex = /_+/g;

    return orgLines.map((line) => {
      let match;
      let stack = [];
      regex.lastIndex = 0;

      // 強調記号をスタックに追加または削除
      while ((match = regex.exec(line)) !== null) {
        if (stack.length % 2 === 0 || stack[stack.length - 1][0] === match[0]) {
          stack.push(match);
        } else {
          stack.pop();
        }
      }

      // スタックのサイズが奇数の場合、最後の要素を削除
      if (stack.length % 2 === 1) stack.pop();

      // スタックの要素を `*` に置き換え
      stack.forEach((matched) => {
        const first = matched.index;
        const end = matched.index + matched[0].length;
        const before = line.slice(0, first);
        const after = line.slice(end);
        line = before + "*".repeat(matched[0].length) + after;
      });

      return line;
    });
  }

  /**
   * 番号付きリストの番号を連番確認及びソートする
   * @param {string[]} orgLines - 修正対象のMarkdownテキスト
   * @returns {string[]} 修正後のMarkdownテキスト
   */
  #AdjustOrderedListNumbers(orgLines) {
    let isInOrderedList = false;
    let listStartIndex = 0;
    let listItems = [];
    let lastListNumberByLevel = {};
    let currentLevel = 0;

    const adjustList = (levelChange) => {
      if (listItems.length > 0) {
        let listNumber = lastListNumberByLevel[currentLevel] || 0;
        listItems.forEach((item, index) => {
          const [_, spaces, rest] = item.match(/^(\s*\d+\.\s*)(.*)$/);
          listNumber += 1;
          orgLines[listStartIndex + index] =
            `${spaces.replace(/\d+/, listNumber)}${rest}`;
        });
        listItems = [];
        if (levelChange < 0) lastListNumberByLevel[currentLevel] = 0;
        else lastListNumberByLevel[currentLevel] = listNumber;
        currentLevel += levelChange;
      }
    };

    let previousLineIndent = 0;
    orgLines.forEach((line, index) => {
      const trimmedLine = line.trimStart();
      const currentLineIndent = line.length - trimmedLine.length;

      if (/^\d+\./.test(trimmedLine)) {
        if (!isInOrderedList) {
          isInOrderedList = true;
          listStartIndex = index;
        } else if (previousLineIndent !== currentLineIndent) {
          adjustList(previousLineIndent < currentLineIndent ? 1 : -1);
          listStartIndex = index;
        }
        listItems.push(line);
      } else {
        if (isInOrderedList) {
          adjustList(0);
          isInOrderedList = false;
          lastListNumberByLevel = {};
        }
      }
      previousLineIndent = currentLineIndent;
    });

    // 最後の番号付きリストを調整
    adjustList(0);

    return orgLines;
  }

  /**
   * 見出しやリストなど記法の分かれ目や見出しとそこに属する本文との境に改行を挿入する
   * @param {string} orgLine - 処理対象のMarkdownテキスト
   * @returns {string} - 改行を追加したMarkdownテキスト
   */
  #AddLineBreaks(orgLines) {
    // 正規表現パターンを定義
    const headingPattern = /^(#{1,6})\s.*$/; // 見出しのパターン
    const listPattern = /^\s*(\*|-|\+)\s.*$/; // リストのパターン
    const numListPattern = /^\s*(\d\.)\s.*$/; // 番号付きリスト
    const blockquotesPattern = /^\s*>+\s.*/;

    // リストの連続性を判定する関数
    function areListsContinuous(line1, line2) {
      // 前の行と現在の行がどちらも箇条書きリストであることを確認
      line1 = line1.replace(/\n+/, "");
      return listPattern.test(line1) && listPattern.test(line2);
    }
    function areNumListsContinuous(line1, line2) {
      // 前の行と現在の行がどちらも番号付きリストであることを確認
      line1 = line1.replace(/\n+/, "");
      return numListPattern.test(line1) && numListPattern.test(line2);
    }
    function areAllListContinuous(line1, line2) {
      // 前の行と現在の行が箇条書きと番号付きで0階層か確認
      line1 = line1.replace(/\n+/, "");
      if (!listPattern.test(line1) && !numListPattern.test(line1)) return false;
      if (!listPattern.test(line2) && !numListPattern.test(line2)) return false;
      if (line2.length == line2.trimStart().length) return false;
      else return true;
    }
    function areHorizontalContinuous(line1, line2) {
      // 前の行と現在の行が箇条書きと番号付きで0階層か確認
      line1 = line1.replace(/\n+/, "");
      return ValidateMd.isHorizon(line1) && ValidateMd.isHorizon(line2);
    }
    function areBlockquoteContinuous(line1, line2) {
      // 前の行と現在の行が箇条書きと番号付きで0階層か確認
      line1 = line1.replace(/\n+/, "");
      return blockquotesPattern.test(line1) && blockquotesPattern.test(line2);
    }
    function notPatternContinuous(line1, line2) {
      line1 = line1.replace(/\n+/, "");
      return (
        !listPattern.test(line1) &&
        !numListPattern.test(line1) &&
        !headingPattern.test(line1) &&
        !ValidateMd.isHorizon(line1) &&
        !blockquotesPattern.test(line1) &&
        !listPattern.test(line2) &&
        !numListPattern.test(line2) &&
        !headingPattern.test(line2) &&
        !ValidateMd.isHorizon(line2) &&
        !blockquotesPattern.test(line2)
      );
    }

    // 改行を削除してから適切な位置に改行を挿入する
    for (let i = 1; i < orgLines.length; i++) {
      // 改行のみの場合は飛ばす
      if (orgLines[i - 1].trim() == "" || orgLines[i].trim() == "") continue;

      // リストが連続している場合は改行を挿入しない
      if (areListsContinuous(orgLines[i - 1], orgLines[i])) continue;
      if (areNumListsContinuous(orgLines[i - 1], orgLines[i])) continue;
      if (areAllListContinuous(orgLines[i - 1], orgLines[i])) continue;
      if (areHorizontalContinuous(orgLines[i - 1], orgLines[i])) continue;
      if (areBlockquoteContinuous(orgLines[i - 1], orgLines[i])) continue;
      if (notPatternContinuous(orgLines[i - 1], orgLines[i])) continue;
      orgLines[i] = `\n${orgLines[i]}`;
    }

    // 最後の行に改行を追加する
    orgLines[orgLines.length - 1] = `${orgLines[orgLines.length - 1]}\n`;

    return orgLines;
  }
}
