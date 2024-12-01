import { listOne, listTwo } from './input';

const similarityScores = listOne.map((n1) => {
	return n1 * listTwo.filter((n2) => n1 === n2).length
})

const totalSimilarityScore = similarityScores.reduce((acc, score) => acc + score, 0);

console.log(totalSimilarityScore)
