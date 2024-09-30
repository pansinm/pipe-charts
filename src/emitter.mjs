import { EventEmitter } from "events";
const emitter = new EventEmitter();

const rows = [];

const stdin = process.stdin;

stdin.setEncoding("utf8");

stdin.on("readable", () => {
  const chunk = stdin.read();
  if (chunk !== null) {
    const readLines = chunk
      .trim()
      .split(/[\n\r]+/)
      .map((line) => line.trim())
      .filter(Boolean);
    rows.push(...readLines);
    emitter.emit("updated", rows);
  }
});

stdin.on("end", () => {
  emitter.emit("done", rows);
});

export default emitter;
