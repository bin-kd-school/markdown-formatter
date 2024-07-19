import { MdFmtr } from "../index.js";
import { argArray, argStr } from "./argument.js";

const mdfmtr = new MdFmtr(argStr());
console.log(mdfmtr.fixedMdText);
console.log(mdfmtr.errors);
