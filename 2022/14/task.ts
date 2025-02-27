import { paths } from './input';

enum FixedPointType {
	Stone,
	Sand,
}

interface FixedPoint {
	x: number;
	y: number;
	t: FixedPointType;
}

interface Point {
	x: number;
	y: number;
}

interface Bounds {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
}

const fixedPoints: FixedPoint[] = getFixedPoints();

let fallingBit: Point = {
	x: 500,
	y: 0,
};

let fixedSandCount = 0;

function getFixedPoints() {
	const fixedPoints: FixedPoint[] = [];

	for (const path of paths) {
		for (let i = 0; i < path.length - 1; i++) {
			const pointA = path[i];
			const pointB = path[i + 1];

			if (pointA.x === pointB.x) {
				const higherPoint = pointA.y < pointB.y ? pointA : pointB;
				const lowerPoint = pointA.y < pointB.y ? pointB : pointA;

				for (let y = higherPoint.y; y <= lowerPoint.y; y++) {
					if (fixedPoints.some((p) => p.y === y && p.x === pointA.x)) continue;
					fixedPoints.push({
						t: FixedPointType.Stone,
						x: pointA.x,
						y,
					});
				}
			}
			if (pointA.y === pointB.y) {
				const leftPoint = pointA.x < pointB.x ? pointA : pointB;
				const rightPoint = pointA.x < pointB.x ? pointB : pointA;

				for (let x = leftPoint.x; x <= rightPoint.x; x++) {
					if (fixedPoints.some((p) => p.x === x && p.y === pointA.y)) continue;
					fixedPoints.push({
						t: FixedPointType.Stone,
						x,
						y: pointA.y,
					});
				}
			}
		}
	}

	return fixedPoints
}

function getBounds(paths: Point[][]): Bounds {
	let minX = Infinity, maxX = 0, minY = 0, maxY = 0;

	for (let path of paths) {
		for (let point of path) {
			if (point.x < minX) {
				minX = point.x;
			}
			if (point.x > maxX) {
				maxX = point.x;
			}
			if (point.y < minY) {
				minY = point.y;
			}
			if (point.y > maxY) {
				maxY = point.y;
			}
		}
	}

	return {
		minX: minX - 1,
		maxX: maxX + 1,
		minY,
		maxY: maxY + 2,
	}
}

function render(fallingBit: Point, fixedPoints: FixedPoint[], bounds: Bounds) {
	let output = '';

	for (let y = bounds.minY; y <= bounds.maxY; y++) {
		for (let x = bounds.minX; x <= bounds.maxX; x++) {
			if (y === bounds.maxY) {
				output += '#';
				continue;
			}

			if (x === fallingBit.x && y === fallingBit.y) {
				output += '.';
				continue;
			}

			const fixedPoint = fixedPoints.find((p) => p.x === x && p.y === y);
			if (fixedPoint) {
				output += fixedPoint.t === FixedPointType.Sand ? 'o' : '#';
				continue;
			}
			else {
				output += ' ';
			}
		}
		output += '\n';
	}

	process.stdout.write(output);
}


function main() {
	const bounds = getBounds(paths);
	let startTime = Date.now();
	let fixedPoints = getFixedPoints();
	let fallingBit: Point = {
		x: 500,
		y: 0,
	};

	while (true) {
		let xDeltas = [0, -1, 1];
		let couldFall = false;
		for (let xDelta of xDeltas) {
			if (!fixedPoints.some((p) =>
				p.x === fallingBit.x + xDelta && p.y === fallingBit.y + 1
			)) {
				fallingBit.y++;
				fallingBit.x += xDelta;
				couldFall = true;
				break;
			}
		}

		if (!couldFall || fallingBit.y === bounds.maxY - 1) {
			// render(fallingBit, fixedPoints, bounds);
			
			if (fallingBit.x === bounds.minX) {
				bounds.minX--;
			}

			if (fallingBit.x === bounds.maxX) {
				bounds.maxX++;
			}

			fixedPoints.push({
				t: FixedPointType.Sand,
				...fallingBit,
			});
			fixedSandCount++;

			// if (fixedSandCount % 1000 === 0) {
			// 	console.log('Progress', Number(fixedSandCount / 25402 * 100).toFixed(2) + '%');
			// }

			if (fallingBit.y === 0) {
				render(fallingBit, fixedPoints, bounds);
				console.log('Total bits:', fixedSandCount);
				console.log('Total time:', Date.now() - startTime);
				break;
			}

			fallingBit.x = 500;
			fallingBit.y = 0;
		}

		// render(fallingBit, fixedPoints, bounds);
	}
}

main()

if (process.platform === 'win32') {
	var rl = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.on('SIGINT', function () {
		process.emit('SIGINT');
	});
}

process.on('SIGINT', function () {
	//graceful shutdown
	process.exit();
})
