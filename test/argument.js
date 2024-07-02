/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *
 * 引数に渡す前に、誤った記法にしてください
 * 
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
const argArray = [
  "#    マークダウンの校正アイデア",
  "",
  " 参考 url",
  " https://qiita.com/tbpgr/items/989c6badefff69377da7",
  "**まず初めにインデントの統一をする**",
  "",
  " ##見出し",
  "",
  "###修正",
  "",
  "-     1",
  "  - 2",
  "    -3",
  "",
  " 1. a",
  "    2.b",
  "     1.c",
  "         - c",
  "",
  "       1.c",
  "       - c",
  "    1.c",
  " 1. a",
  "    - b",
  "     - c",
  "         - c",
  "",
  "         - c",
  "        1.c",
  "      1.c",
  "- a",
  "   - a",
  "   - a",
  "    - a",
  "      - a",
  "      - a",
  "       - a",
  "      - a",
  "     - a",
  "    - a",
  "  - a",
  ">>>>>>>      123",
  " >  12",
  "",
  ">>1",
  ">>a",
  ">> b",
];

const argStr =
  "#    マークダウンの校正アイデア\n\n 参考 url\n https://qiita.com/tbpgr/items/989c6badefff69377da7\n**まず初めにインデントの統一をする**\n\n ##見出し\n\n###修正\n\n-     1\n  - 2\n    -3\n\n 1. a\n    2.b\n     1.c\n         - c\n\n       1.c\n       - c\n    1.c\n 1. a\n    - b\n     - c\n         - c\n\n         - c\n        1.c\n      1.c\naaa\n     - a\n   - a\n   - a\n    - a\n     - a\n      - a\n       - a\n      - a\n     - a\n    - a\n  - a\n>>>>>>>      123\n >  12\n\n>>1\n>>a\n>> b";

export { argArray, argStr };
