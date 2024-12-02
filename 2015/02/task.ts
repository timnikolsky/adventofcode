import { dimensions } from './input';

let totalPaperNeeded = 0;

for (let presentDimensions of dimensions) {
	const [l, w, h] = presentDimensions;

	const surfaceArea = (l * w + w * h + l * h) * 2;
	const smallestSide = Math.min(l * w, w * h, l * h);

	totalPaperNeeded += surfaceArea + smallestSide;
}

console.log(totalPaperNeeded);
