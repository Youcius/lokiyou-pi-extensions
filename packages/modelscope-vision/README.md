# @lokiyou/modelscope-vision

Vision extension for Pi Coding Agent powered by the ModelScope API.

It provides tools for describing images and answering questions about images from either a public URL or a local file path.

## Commands and tools

| Name | Description |
| --- | --- |
| `/modelscope-vision key` | Set the ModelScope API access token. |
| `/modelscope-vision model` | Set the vision model ID, for example `Qwen/Qwen3-VL-32B-Instruct`. |
| `/modelscope-vision base-url` | Optionally set a compatible API base URL. |
| `/modelscope-vision config` | Show the current configuration. |
| `vision-describe` | Generate a description of an image. |
| `vision-ask` | Ask a specific question about an image. |

## Installation

```bash
pi install npm:@lokiyou/modelscope-vision
/reload
```

## Configuration

The extension stores its configuration at:

```text
~/.pi/agent/extensions/modelscope-vision/config.json
```

### Set the API key

```text
/modelscope-vision key
```

Enter your ModelScope access token when prompted.

### Set the model

```text
/modelscope-vision model Qwen/Qwen3-VL-32B-Instruct
```

### Set a custom base URL

```text
/modelscope-vision base-url https://api-inference.modelscope.cn/v1
```

### View the current configuration

```text
/modelscope-vision config
```

After changing configuration, run `/reload` if needed.

## Inputs

Both tools support either of the following:

- `image_url`: a public image URL
- `image_path`: an absolute local file path

## Examples

Plain-language prompts:

- "Describe this image in detail."
- "How many people are in this photo?"
- "What does the text in this image say?"

Tool-style examples:

```text
vision-describe({ image_url: "https://example.com/cat.jpg", language: "en" })
vision-ask({ image_path: "C:/images/screenshot.png", question: "What error message is shown?" })
```

## License

MIT
