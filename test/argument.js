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
  "`aaaa`ndf `",
  "dsafsd`ad``dfsd",
  "`dsfasdfsd`fsdd`ds``dsdf`",
  " ##見出し",
  "",
  "###修正",
  "",
  "+     1",
  "  * 2",
  "    -3",
  "**dfs",
  "--------",
  "* *****",
  " 1. a",
  "    2.b",
  "     1.c",
  "         - c",
  "",
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
  ">>>>>>>      123",
  " >  12",
  "",
  ">>`fsdf`fd`dfs",
  "# 調理法",
  "Some **bold** text.",
  "## 冷やしトマト",
  "*Italic* text and other content.",
  "### 材料",
  "### 行程",
  "## グラタン",
  "### 材料",
  "### 行程",
  "# Title 2",
  "## Subtitle 1",
  "aaa",
  "## Subtitle 1",
];

const argStr = () => argArray.join("\n");

export { argArray, argStr };
