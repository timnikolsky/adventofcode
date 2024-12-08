const file = Bun.file(import.meta.dir + '/input.txt');
const text = await file.text();

export const reports = text.split('\r\n').map((report) => {
	return report.split(' ').map(Number);
});
