import { listOne, listTwo } from './input';

const listOneSorted = Array.from(listOne).sort((a, b) => a - b);
const listTwoSorted = Array.from(listTwo).sort((a, b) => a - b);

const distances = listOneSorted.map((n, i) => {
	return Math.abs(n - listTwoSorted[i]);
});

const totalDistance = distances.reduce((acc, distance) => acc + distance, 0);

console.log(totalDistance)
