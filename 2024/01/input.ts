const file = Bun.file(import.meta.dir + '/input.txt');
const text = await file.text();
const pairs = text.split('\r\n').map((pair) => {
	return pair.split('   ').map(Number);
});

export const listOne = pairs.map(([a, b]) => a);
export const listTwo = pairs.map(([a, b]) => b);
