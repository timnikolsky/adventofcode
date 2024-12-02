import { instruction } from './input';

const openingParenthesisCount = instruction.match(/\(/g)!.length;
const closingParenthesisCount = instruction.match(/\)/g)!.length;

const finalFloor = openingParenthesisCount - closingParenthesisCount;

console.log(finalFloor);
