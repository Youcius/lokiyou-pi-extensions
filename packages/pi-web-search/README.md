# 🌐 @enjoy4ever/pi-web-search

**Pi Coding Agent 扩展** — 统一搜索 + URL 内容提取。自动选择 Grok (xAI) 或 AnySearch 搜索提供商。

---

## ✨ 功能

| 工具 | 描述 |
|------|------|
| `web_search` | 搜索网络，返回 AI 合成的答案 + 来源引用 |
| `web_fetch` | 提取 URL 可读内容为 Markdown |

---

## 📦 安装

```bash
pi install npm:@enjoy4ever/pi-web-search
/reload
```

---

## 🔑 配置

编辑 `~/.pi/agent/extensions/pi-web-search/config.json`：

```json
{
  "provider": "auto",
  "grokApiUrl": "",
  "grokApiKey": "",
  "grokModel": "",
  "tavilyApiUrl": "",
  "tavilyApiKey": "",
  "context7ApiKey": "",
  "anysearchApiKey": ""
}
```

| 字段 | 说明 |
|------|------|
| `provider` | `"auto"`（自动链：Context7→Grok→AnySearch）、`"context7"`、`"grok"`、`"anysearch"` |
| `context7ApiKey` | Context7 API 密钥，从 [context7.com](https://context7.com) 获取 |
| `grokApiKey` | xAI API 密钥，从 [console.x.ai](https://console.x.ai) 获取 |
| `grokModel` | Grok 模型名，如 `grok-3` |
| `tavilyApiUrl` | Tavily API 地址，留空用默认 `https://api.tavily.com` |
| `tavilyApiKey` | Tavily API 密钥（可选，为 Grok 补充搜索来源） |
| `anysearchApiKey` | AnySearch API 密钥 |

首次加载如果文件不存在，会自动生成模板。配好 API 密钥后进 Pi 重载 `/reload` 即可使用。

---

## 🎯 使用示例

> "最近有什么 AI 新闻？"
> Agent 会自动调用 `web_search` 工具。

> "把这篇文章的内容提取出来给我看"
> Agent 会自动调用 `web_fetch` 工具。

---

