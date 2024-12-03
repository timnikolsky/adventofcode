import { memory } from './input';

const mulFunctuionRegex = /mul\(\d{1,3}\,\d{1,3}\)/g;

const mulInstructions = memory.match(mulFunctuionRegex)!;

let sumOfProducts = 0;

for (const instruction of mulInstructions) {
	const functionArguments = instruction.match(/\d{1,3}/g)!.map(Number);
	sumOfProducts += functionArguments[0] * functionArguments[1];
}

console.log(sumOfProducts);
