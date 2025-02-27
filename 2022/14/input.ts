const file = Bun.file(import.meta.dir + '/input.txt');
const text = await file.text();

export const paths = text.split('\n').map((pathString) => {
	return pathString.split(' -> ').map((pointString) => {
		const coords = pointString.split(',').map(Number)
		return {
			x: coords[0],
			y: coords[1]
		}
	})
});