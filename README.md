# pipe-charts

Generate charts from bash output.

## Install

```bash
npm install -g @sinm/pipe-charts
```

## Usage
```bash
echo -e "day1 1\nday2 4\nday3 9" | pipe-charts --type bar
```

output:

![image](docs/img-1.png)

## With LLM
```bash
# config envs
echo  "LLM_BASE_URL=https://your-llm-api.com"\nLLM_API_KEY=api_key\nLLM_MODEL=gpt-3.5-turbo\nKROKI_HOST=https://kroki.io/" > ~/.pipe-charts
echo "day1 1\nday2 4\nday3 9" | pipe-charts --prompt "generate pie chart from this data" -o output.png
```

## LICENSE

MIT

This repo use fonts [Source Han Sans](https://github.com/adobe-fonts/source-han-sans/blob/release/LICENSE.txt)
