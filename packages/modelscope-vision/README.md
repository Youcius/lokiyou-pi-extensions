# 🖼️ modelscope-vision

**Pi Coding Agent 扩展** — 通过 ModelScope API 实现图片视觉理解。

> 开一张图，AI 替你「看」—— 描述场景、识别人物、阅读文字、回答你对图片的任何问题。

---

## ✨ 功能

| 命令 / 工具 | 描述 |
|------------|------|
| `/modelscope-vision key` | 设置 ModelScope API 密钥（访问令牌） |
| `/modelscope-vision model` | 配置模型 ID（如 `Qwen/Qwen3-VL-32B-Instruct`） |
| `/modelscope-vision config` | 查看当前配置 |
| `vision-describe`（工具） | 让 Agent 调用的图片描述工具 |
| `vision-ask`（工具） | 让 Agent 调用的图片问答工具 |

---

## 📦 安装

```bash
# 通过 npm 安装
pi install npm:modelscope-vision

# 安装后重载扩展
/reload
```


### 本地测试

```bash
# 把整个目录链接到 pi 扩展目录
mklink /J "%USERPROFILE%\.pi\agent\extensions\modelscope-vision" "%USERPROFILE%\modelscope-vision"

# 然后重载
/reload
```

---

## 🔑 配置

**第一步：设置 API 密钥**

在 Pi 交互界面中运行：

```
/modelscope-vision key
```

然后输入你的 [ModelScope 访问令牌](https://modelscope.cn/my/overview)（免费注册即可获取）。

**可选：配置模型**

```
/modelscope-vision model Qwen/Qwen3-VL-32B-Instruct
```

可以去 [ModelScope 模型页](https://modelscope.cn/organization/qwen) 看看有哪些模型可选。

**查看当前配置：**

```
/modelscope-vision config
```

配置存储在 `~/.pi/agent/extensions/modelscope-vision/config.json`。

---

## 🎯 使用示例

### 描述图片

> "帮我看看这张图里有什么？"
> Agent 会自动调用 `vision-describe` 工具。

### 问具体问题

> "这张照片里有几个人？穿着什么颜色的衣服？"
> Agent 会自动调用 `vision-ask` 工具。

### 支持图片来源

- **网络图片**：传入 `image_url`（公开可访问的 URL）
- **本地图片**：传入 `image_path`（绝对路径，扩展会自动读取并编码）

---

---

## 📄 License

MIT
