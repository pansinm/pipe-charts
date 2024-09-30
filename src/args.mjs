import { program } from "commander";

program
  .option("-p, --prompt <prompt>", "llm prompt")
  .option("-t, --title <title>", "title")
  .option("-w, --width <width>", "canvas width", 800)
  .option("-h, --height <height>", "canvas height", 600)
  .option("-o, --output <output>", "output file")
  .option("-s, --splitter <splitter>", "columns splitter")
  .option("-x <x>", "x axis column")
  .option("--x-type <xType>", "xAxis type")
  .option("-y <y>", "y axis column")
  .option("--y-type <yType>", "yAxis type")
  .option("--type <type>", "type of chart, default line", "line")
  .option("--dark-mode", "Enable dark mode", false);

program.parse();

/**
 * @type {{
 * title?: string,
 * width?: number,
 * height?: number,
 * splitter?: string,
 * darkMode?: boolean,
 * x?: string,
 * xType?: string,
 * y?: string,
 * yType?: string,
 * type?: string,
 * output?: string
 * prompt?: string
 * }}
 */
export default { ...program.opts() };
