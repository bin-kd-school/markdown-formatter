import { MdFmtr } from "../index.js";
import { argArray, argStr } from "./argument.js";
/*
const mdfmtr = new MdFmtr(argStr);
console.log(mdfmtr.fixedMdText);
console.log(mdfmtr.errors);
*/

function AdjustListIndentation(lines) {
  let isListPreLine = false;
  let currentIndentLevel = 0;
  let spacesStack = [];

  return lines.map((line) => {
    const trimedLine = line.trimStart();
    const leadingSpaces = line.length - trimedLine.length;

    // 改行のみの場合は現状まま返す
    if (trimedLine.length == 0) return trimedLine;

    if (/^\d+\./.test(trimedLine) || /^[*+-]/.test(trimedLine)) {
      if (isListPreLine) {
        for (const preSpace of spacesStack) {
          if (leadingSpaces - preSpace >= 2) {
            currentIndentLevel += 1;
            break;
          } else {
            currentIndentLevel = currentIndentLevel
              ? currentIndentLevel - 1
              : currentIndentLevel;
          }
        }
        spacesStack.unshift(leadingSpaces);
      } else {
        spacesStack.unshift(0);
      }
      isListPreLine = true;
    } else {
      currentIndentLevel = 0;
      spacesStack = [];
      isListPreLine = false;
    }

    return " ".repeat(currentIndentLevel * 2) + trimedLine;
  });
}

console.log(AdjustListIndentation(argArray));
