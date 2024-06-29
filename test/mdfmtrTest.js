import { MdFmtr } from "../index.js";
import { ProofreadUtil } from "../src/ProofreadUtil.js";
import { argArray, argStr } from "./argument.js";

console.log(argArray);
/*
const mdfmtr = new MdFmtr(argStr);
console.log(mdfmtr.fixedMdText);
console.log(mdfmtr.errors);
*/
console.log(ProofreadUtil.all(argArray));
