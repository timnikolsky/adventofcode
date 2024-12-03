const file = Bun.file(import.meta.dir + '/input.txt');
const text = await file.text();

export const memory = text
