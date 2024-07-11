import { MdFmtr } from "../index.js";
import { ProofreadUtil } from "../src/ProofreadUtil.js";
import { argArray, argStr } from "./argument.js";

console.log(argStr());
console.log("\n", "修正↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓", "\n");
const mdfmtr = new MdFmtr(argStr());
console.log(mdfmtr.fixedMdText);
console.log(mdfmtr.errors);
