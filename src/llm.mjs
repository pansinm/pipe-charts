import OpenAI from "openai";
import { LLM_API_KEY, LLM_BASE_URL } from "./env.mjs";

const client = new OpenAI({
  baseURL: LLM_BASE_URL,
  apiKey: LLM_API_KEY,
});

export default client;
