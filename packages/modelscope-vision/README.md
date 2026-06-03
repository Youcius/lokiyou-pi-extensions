# 🖼️ @lokiyou/modelscope-vision

Pi Coding Agent 扩展：通过 ModelScope API 实现图片视觉理解。

> 开一张图，AI 替你“看”—— 描述场景、识别人物、阅读文字、回答你对图片的任何问题。

## 功能

| 命令 / 工具 | 说明 |
|---|---|
| `/modelscope-vision key` | 设置 ModelScope API 密钥（访问令牌） |
| `/modelscope-vision model` | 配置模型 ID，例如 `Qwen/Qwen3-VL-32B-Instruct` |
| `/modelscope-vision base-url` | 可选：配置兼容的 API 地址 |
| `/modelscope-vision config` | 查看当前配置 |
| `vision-describe` | 让 Agent 自动描述图片 |
| `vision-ask` | 让 Agent 针对图片提问并回答 |

## 安装

```bash
pi install npm:@lokiyou/modelscope-vision
/reload
```

## 本地开发

如果你想直接在本地目录调试，可以把整个目录链接到 Pi 扩展目录：

```bash
mklink /J "%USERPROFILE%\.pi\agent\extensions\modelscope-vision" "%USERPROFILE%\modelscope-vision"
```

然后执行：

```bash
/reload
```

## 配置

### 1) 设置 API 密钥

在 Pi 里执行：

```text
/modelscope-vision key
```

输入你的 [ModelScope 访问令牌](https://modelscope.cn/my/overview)。

### 2) 选择模型

```text
/modelscope-vision model Qwen/Qwen3-VL-32B-Instruct
```

### 3) 如需更换 API 地址

```text
/modelscope-vision base-url https://api-inference.modelscope.cn/v1
```

### 4) 查看当前配置

```text
/modelscope-vision config
```

配置存放在 `~/.pi/agent/extensions/modelscope-vision/config.json`。

## 使用示例

- “帮我看看这张图里有什么？”
- “这张照片里有几个人？穿着什么颜色的衣服？”
- “图里的这段文字是什么意思？”

支持的图片来源：

- **网络图片**：传入 `image_url`（公开可访问的 URL）
- **本地图片**：传入 `image_path`（绝对路径，扩展会自动读取并编码）

## 许可

MIT
