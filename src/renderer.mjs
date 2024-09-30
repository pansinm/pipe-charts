import fs from "fs";
import path from "path";
import * as echarts from "echarts";
import { createCanvas, registerFont } from "canvas";
import { fileURLToPath } from "url";
import zlib from "zlib";
import { KROKI_HOST } from "./env.mjs";

const dirname =
  import.meta.dirname || path.dirname(fileURLToPath(import.meta.url));
const fontDir = path.resolve(dirname, "../fonts");

registerFont(`${fontDir}/SourceHanSansCN-Regular.otf`, {
  family: "SourceHanSansCN-Regular",
});

echarts.setPlatformAPI({
  createCanvas,
});

export function renderCharts(
  output = { width: 800, height: 600, fontSize: 12 },
  options
) {
  const canvas = createCanvas(+output.width, +output.height);
  const ctx = canvas.getContext("2d");
  ctx.font = output.fontSize + "px";
  const chart = echarts.init(canvas, null, { devicePixelRatio: 2 });
  options.animation = false;
  options.textStyle = {
    fontSize: output.fontSize,
    fontFamily: "SourceHanSansCN-Regular",
  };
  options.backgroundColor = options.darkMode ? "#1f1f1f" : "#fff";
  chart.setOption(options); // 就是echarts的options
  const buffer = chart.getDom().toBuffer(); // 返回buffer
  fs.writeFileSync(output.file, buffer);
}

function encode(str) {
  const data = Buffer.from(str, "utf8");
  const compressed = zlib.deflateSync(data, { level: 9 });
  const result = Buffer.from(compressed)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return result;
}

export function renderMarkdownDiagram(lang, code, outputFile) {
  const type = outputFile.endsWith(".svg") ? "svg" : "png";
  const url = `${KROKI_HOST}${lang}/${type}/${encode(code)}`;
  fetch(url).then((res) => {
    if (res.ok) {
      res.arrayBuffer().then((buffer) => {
        fs.writeFileSync(outputFile, Buffer.from(buffer));
      });
    } else {
      console.error(
        ["Error rendering diagram:", res.statusText, lang, code, url].join("\n")
      );
    }
  });
}
