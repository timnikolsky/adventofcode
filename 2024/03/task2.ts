import { memory } from './input';

const functuionsRegex = /mul\(\d{1,3}\,\d{1,3}\)|do\(\)|don't\(\)/g;

const instructions = memory.match(functuionsRegex)!;

let sumOfProducts = 0;
let mulEnabled = true;

for (const instruction of instructions) {
	if (instruction === 'do()') {
		mulEnabled = true;
	} else if (instruction === "don't()") {
		mulEnabled = false;
	}
	else if (mulEnabled) {
		const functionArguments = instruction.match(/\d{1,3}/g)!.map(Number);
		sumOfProducts += functionArguments[0] * functionArguments[1];
	}
}

console.log(sumOfProducts);
