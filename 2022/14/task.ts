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

interface FallingBit {
	x: number;
	y: number;
}

const fixedPoints: FixedPoint[] = [];

let fallingBit: FallingBit = {
	x: 500,
	y: 0,
};

let fixedSandCount = 0;

for (const path of paths) {
	// fixedPoints.push({
	// 	t: FixedPointType.Stone,
	// 	x: path[0].x,
	// 	y: path[0].y
	// })

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

let minX = Infinity;
let maxX = 0;
let minY = Infinity;
let maxY = 0;

for (let path of paths) {
	for (let point of path) {
		if (point.x < minX) {
			minX = point.x;
		}
		if (point.x > maxX) {
			maxX = point.x;
		}
	let output = '';

	// for (let y = 0; y < maxY + 3; y++) {
	// 	for (let x = minX - 1; x < maxX + 1; x++) {

	for (let y = 0; y < maxY + 3; y++) {
		for (let x = minX - 1 - 2; x < maxX + 1 + 2; x++) {
			if (x === fallingBit.x && y === fallingBit.y) {
				output += '\x1b[103m  \x1b[49m';
				continue;
			}

			if (y === maxY + 2) {
				output += '\x1b[47m  \x1b[49m';
				continue;
			}

			let fixedPoint = fixedPoints.find((p) => p.x === x && p.y === y);

			if (!fixedPoint) {
				output += '  ';
			} else if (fixedPoint.t === FixedPointType.Stone) {
				output += '\x1b[47m  \x1b[49m';
			} else if (fixedPoint.t === FixedPointType.Sand) {
				output += '\x1b[43m  \x1b[49m';
			}
		}
		output += y + ' \n';
	}

	process.stdout.write(output);
	console.log(fixedSandCount);
}

function tick() {
	if (fallingBit.y === maxY + 1) {
		fixedPoints.push({
			t: FixedPointType.Sand,
			...fallingBit,
		});
		fixedSandCount++;
		fallingBit = {
			x: 500,
			y: 0,
		};

		// if (Math.random() < 0.1) render();
	}

	if (!fixedPoints.some((p) => p.x === fallingBit.x && p.y === fallingBit.y + 1)) {
		fallingBit.y++;
	} else {
		if (!fixedPoints.some((p) => p.x === fallingBit.x - 1 && p.y === fallingBit.y + 1) && fallingBit.x > minX - 1) {
			fallingBit.x--;
			fallingBit.y++;
		} else if (!fixedPoints.some((p) => p.x === fallingBit.x + 1 && p.y === fallingBit.y + 1) && fallingBit.x < maxX + 1) {
			fallingBit.x++;
			fallingBit.y++;
		} else {
			fixedPoints.push({
				t: FixedPointType.Sand,
				...fallingBit,
			});
			fixedSandCount++;
			fallingBit = {
				x: 500,
				y: 0,
			};
			// if (Math.random() < 0.1) render();
		}
	}

	if (fixedPoints.some((p) => p.x === 500 && p.y === 0)) {
		return fixedSandCount;
		
	}
}

let result

while (!result) {
	result = tick();
	if (result) {
		console.log(result)
		render()
	}
}

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
});
