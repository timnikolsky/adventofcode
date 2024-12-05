const file = Bun.file(import.meta.dir + '/input.txt');
const text = await file.text();

export const input = text.split('\r\n').map((line) => line.split(''))

export const width = input[0].length
export const height = input.length
