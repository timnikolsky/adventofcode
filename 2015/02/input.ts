const file = Bun.file(import.meta.dir + '/input.txt');
const text = await file.text();

export const dimensions = text.split('\r\n').map((dimention) => {
	return dimention.split('x').map(Number);
});
