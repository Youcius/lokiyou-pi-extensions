# @lokiyou/modelscope-vision

Simple image understanding for Pi Coding Agent.

Install it, set your ModelScope API key, choose a model, and ask normal questions about images. The extension is designed to feel straightforward for everyday use.

## What it does

It adds image understanding to Pi.

After installation, you can ask Pi to:

- describe an image
- answer questions about an image
- read visible text in an image
- inspect either a public image URL or a local image file

Most users do not need to call the tools manually.

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

In most cases, you only need to do two things:

1. set your API key
2. choose the model you want to use

### Set the API key

```text
/modelscope-vision key
```

Enter your ModelScope access token when prompted.

### Set the model

```text
/modelscope-vision model Qwen/Qwen3-VL-32B-Instruct
```

### Optional: set a custom base URL

```text
/modelscope-vision base-url https://api-inference.modelscope.cn/v1
```

### View the current configuration

```text
/modelscope-vision config
```

After changing configuration, run `/reload` if needed.

## How to use it

After installation, use normal prompts such as:

- "Describe this image in detail."
- "How many people are in this photo?"
- "What does the text in this image say?"
- "What error message is shown in this screenshot?"

The extension supports either of the following inputs:

- `image_url` for a public image URL
- `image_path` for an absolute local file path

## License

MIT
