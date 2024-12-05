import { input, width, height } from './input';

let xMasCount = 0;

const firstLetter = 'M'
const middleLetter = 'A'
const lastLetter = 'S'

function processDirection(axis: 'x' | 'y', direction: number) {
	for (let x = 1; x < width - 1; x++) {
		for (let y = 1; y < width - 1; y++) {
			if (input[y][x] !== middleLetter) {
				continue;
			}

			if (axis === 'x') {
				if (
					input[y - 1][x - direction] === firstLetter &&
					input[y + 1][x - direction] === firstLetter &&
					input[y - 1][x + direction] === lastLetter &&
					input[y + 1][x + direction] === lastLetter
				) {
					xMasCount++;
				}
			}
			if (axis === 'y') {
				if (
					input[y - direction][x - 1] === firstLetter &&
					input[y - direction][x + 1] === firstLetter &&
					input[y + direction][x - 1] === lastLetter &&
					input[y + direction][x + 1] === lastLetter
				) {
					xMasCount++;
				}
			}
		}
	}
}

/* M S
	A
   M S */
processDirection('x', 1);
/* S M
	A
   S M */
processDirection('x', -1);
/* M M
	A
   S S */
processDirection('y', 1);
/* S S
	A
   M M */
processDirection('y', -1);

console.log(xMasCount);
