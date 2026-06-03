# 🌐 @lokiyou/pi-web-search

Pi Coding Agent 扩展：统一搜索 + URL 内容提取 + 来源缓存 + 复杂查询拆分。

它会在 `Context7 → Grok → AnySearch` 之间自动选择可用的搜索链路，也支持双语查询、按时间筛选、按域名筛选，以及把来源单独取回。

## 功能

| 工具 | 说明 |
|---|---|
| `web_search` | 搜索网络，返回答案摘要与来源引用 |
| `web_fetch` | 提取 URL 可读内容为 Markdown |
| `get_sources` | 根据 `session_id` 取回之前缓存的来源列表 |
| `search_planning` | 用 Grok 把复杂问题拆成多个子查询并并行搜索 |

## 安装

```bash
pi install npm:@lokiyou/pi-web-search
/reload
```

## 配置

首次加载时，扩展会在 `~/.pi/agent/extensions/pi-web-search/config.json` 生成配置模板。

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
|---|---|
| `provider` | `auto`、`context7`、`grok`、`anysearch` |
| `grokApiUrl` | Grok 接口地址，留空使用默认值 |
| `grokApiKey` | xAI API 密钥 |
| `grokModel` | Grok 模型名，例如 `grok-3` |
| `tavilyApiUrl` | Tavily API 地址，留空使用默认值 |
| `tavilyApiKey` | Tavily API 密钥 |
| `context7ApiKey` | Context7 API 密钥 |
| `anysearchApiKey` | AnySearch API 密钥 |

## 使用方式

- 普通搜索：直接让 Agent 搜索即可。
- 双语搜索：在同一个问题里用 `中文问题 | English query` 的格式。
- 来源缓存：把 `sources` 设为 `false` 时，只返回摘要与 `session_id`，之后可用 `get_sources(session_id)` 取回来源。
- 深度搜索：复杂问题会自动走 `search_planning`，把问题拆开后并行搜索。

## 示例

> “最近有什么 AI 新闻？”

> “把这篇文章的内容提取出来给我看。”

> “量子计算最新进展 | latest advances in quantum computing”

## 备注

如果本地没有配置文件，第一次运行后会自动生成模板；配好密钥后在 Pi 里执行 `/reload` 即可。
