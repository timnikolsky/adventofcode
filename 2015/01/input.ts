const file = Bun.file(import.meta.dir + '/input.txt');
export const instruction = await file.text();