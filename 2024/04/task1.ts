import { input, width, height } from './input';

const word = 'XMAS';
let wordsCount = 0;

function processDirection(deltaX, deltaY) {
	const edgeOffset = word.length - 1;
	const startX = deltaX >= 0 ? 0 : edgeOffset;
	const endX = deltaX <= 0 ? width : width - edgeOffset;
	const startY = deltaY >= 0 ? 0 : edgeOffset;
	const endY = deltaY <= 0 ? height : height - edgeOffset;

	for (let x = startX; x < endX; x++) {
		for (let y = startY; y < endY; y++) {
			let flag = true;
			for (let offset = 0; offset < word.length; offset++) {
				if (input[y + offset * deltaY][x + offset * deltaX] !== word[offset]) {
					flag = false;
					break;
				}
			}

			if (flag) {
				wordsCount++;
			}
		}
	}
}

processDirection(1, 0); // >
processDirection(1, 1); // v>
processDirection(0, 1); // v
processDirection(-1, 1); // <v
processDirection(-1, 0); // <
processDirection(-1, -1); // <^
processDirection(0, -1); // ^
processDirection(1, -1); // ^>

console.log(wordsCount);
