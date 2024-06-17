#!/usr/bin/env node
import os from "os";
import path from "path";
import { renderCharts } from "./renderer.mjs";
import args from "./args.mjs";
import emitter from "./emitter.mjs";

const {
  width,
  height,
  title,
  output,
  darkMode,
  x,
  y,
  type,
  xType,
  yType,
} = args;

function getOutputFile() {
  if (output) {
    return path.resolve(process.cwd(), output);
  }
  const random = Math.random().toString(36).slice(2);
  const imgFile = path.resolve(os.tmpdir(), `${random}.png`);
  return imgFile;
}

const outputFile = getOutputFile();

function render(data) {
  let xIndex = x;
  if (!xIndex && data[0]?.length > 0) {
    xIndex = 0;
  }
  const xData = data.map((item, index) => (xIndex === undefined ? index : item[xIndex]));
  const types = type
    .trim()
    .split(",")
    .map((t) => t.trim());
  let yIndex = y;
  if (!yIndex) {
    yIndex = data[0]?.length - 1;
  }

  const series = `${yIndex}`
    .trim()
    .split(",")
    .map((key, index) => {
      return {
        type: types[index] || types[0],
        data: data.map((item) => item[key.trim()]),
      };
    });

  renderCharts(
    { file: outputFile, width: width, height: height },
    {
      darkMode: darkMode,
      xAxis: {
        type: xType || undefined,
        data: xData,
      },
      yAxis: {
        type: yType || undefined,
      },
      series: series,
      title: {
        text: title,
        x: "center",
      },
    }
  );
}

emitter.on("updated", (data) => {
  render(data);
});

emitter.once("updated", (data) => {
  console.log("output:\t", outputFile);
});
