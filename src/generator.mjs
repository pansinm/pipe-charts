import { LLM_MODEL } from "./env.mjs";
import llm from "./llm.mjs";
import vm from "node:vm";

function evalJavaScript(jsCode, returnVar, content) {
  const output = [];
  const context = {
    console: {
      log: (...args) => {
        output.push(...args);
      },
    },
    content,
    document: new Proxy(
      {},
      {
        get(target, key) {
          return () => {
            return {};
          };
        },
      }
    ),
  };
  const ctx = vm.createContext(context);
  const code = jsCode + (returnVar ? `\n;try{${returnVar};}catch{}` : "");
  const result = vm.runInContext(code, ctx);
  return {
    result,
    output: output.join("\n"),
  };
}

function extractCodeBlock(markdown, lang) {
  const regex = new RegExp("```" + `${lang}([\\s\\S]*?)` + "```", "g");
  const matches = markdown.matchAll(regex);
  const blocks = [...matches].map((match) => match[1]);
  return blocks;
}

async function callLLM(histories) {
  const result = await llm.chat.completions.create({
    model: LLM_MODEL,
    messages: histories,
    // temperature: 0.4,
    max_tokens: 4096,
  });
  return [...histories, ...result.choices.map((choice) => choice.message)];
}

export async function generateCode(data, input) {
  const prompt = `
结合内容，按用户意图进行图表可视化。

<content>
${data}
</content>

<intent>
${input}
</intent>
`.trim();

  let histories = await callLLM([
    {
      role: "system",
      content: `
// 你是一个乐于解答各种问题的助手，你的任务是帮助用户对内容可视化。你可以使用echarts、mermaid及plantuml等工具。
if (echarts) {
  \`\`\`javascript
  // content 为 <content>{content}</content>内文本
  // TODO: 请生成代码，仅使用标准JavaScript语法，确保option符合echarts格式要求，不要调用echarts相关接口
  // const data = process(content);
  // const option = {...};
  \`\`\`
} 
else if (mermaid) {
  \`\`\`mermaid
  %% TODO: 请生成，确保符合 mermaid 语法规范
  \`\`\`
}
else if (plantuml) {
  \`\`\`plantuml
  ' TODO: 请生成，确保符合 plantuml 语法规范
  \`\`\`
}
// 确保输出的图表能正确显示，不要输出错误的代码。
`,
    },
    { role: "user", content: prompt },
  ]);
  const lastMessage = histories[histories.length - 1];
  const jsCode = extractCodeBlock(lastMessage.content, "javascript").join("\n");
  if (jsCode.trim()) {
    const { result: option } = evalJavaScript(jsCode, "option", data);
    if (option) {
      return {
        type: "echarts",
        option,
      };
    }
  }

  const mermaidCode = extractCodeBlock(lastMessage.content, "mermaid").join(
    "\n"
  );
  if (mermaidCode.trim()) {
    return {
      type: "mermaid",
      code: mermaidCode,
    };
  }

  const plantumlCode = extractCodeBlock(lastMessage.content, "plantuml").join(
    "\n"
  );
  if (plantumlCode.trim()) {
    return {
      type: "plantuml",
      code: plantumlCode,
    };
  }
  return {
    type: "text",
    content: lastMessage.content,
  };
}
