---
name: modelscope-vision
description: "Vision/image understanding via ModelScope vision models. Two tools: vision-describe (detailed description) and vision-ask (question answering). Requires API key configuration."
---

# ModelScope Vision

Use this skill when the user asks to:
- Describe an image or photo
- Identify objects, people, text, or scenes in an image
- Ask a specific question about an image ("what breed?", "how many?", "what text?")
- Analyze image content with a custom prompt

## Tools available

| Tool | When to use |
|------|-------------|
| `vision-describe` | User wants a general description, mood, atmosphere, or detailed breakdown of an image |
| `vision-ask` | User has a specific question about an image content |

## Configuration

Both tools need an API key configured once:

```
/modelscope-vision key      # Set your ModelScope access token
/modelscope-vision model    # Change model ID (e.g. Qwen/Qwen3-VL-32B-Instruct)
/modelscope-vision config   # View current config
```

You can also configure the API key and model in the agent's own flow without bothering the user if they've already set it up.

## Image sources

- **Public URL** (`image_url`): Pass the full URL to an online image
- **Local file** (`image_path`): Pass the absolute path to a local image file (the extension reads and encodes it automatically)

## Notes

- The ModelScope API is OpenAI-compatible. You can get a free access token from [modelscope.cn](https://modelscope.cn).
- The extension stores config at `~/.pi/agent/extensions/modelscope-vision/config.json`.
- The underlying `vision` MCP server also works, but this extension works independently without MCP.
