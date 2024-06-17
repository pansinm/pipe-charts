import { EventEmitter } from "events";
import args from "./args.mjs";

const emitter = new EventEmitter();

const rows = [];

const stdin = process.stdin;

stdin.setEncoding("utf8");

stdin.on("readable", () => {
  const chunk = stdin.read();
  if (chunk !== null) {
    const splitter = args.splitter || /\s+/g
    const readLines = chunk.split(/[\n\r]+/);
    readLines.forEach((line) => {
      if (line.trim()) {
        const cols = line.split(splitter);
        rows.push(cols);
      }
    });
    emitter.emit("updated", rows);
  }
});

stdin.on("end", () => {
  emitter.emit("done");
});

export default emitter;
