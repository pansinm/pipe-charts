import { config } from "dotenv";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const configFile = path.resolve(os.homedir(), ".pipe-charts");

if (fs.existsSync(configFile)) {
  config({
    path: [configFile],
    override: false,
  });
}

export const LLM_BASE_URL = process.env.LLM_BASE_URL;
export const LLM_API_KEY = process.env.LLM_API_KEY;
export const LLM_MODEL = process.env.LLM_MODEL || "gpt-3.5-turbo";
export const KROKI_HOST = process.env.KROKI_HOST || "https://kroki.io/";
