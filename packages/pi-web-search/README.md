# @lokiyou/pi-web-search

Unified web search and URL content extraction for Pi Coding Agent.

The extension can search the web, extract readable page content, cache source lists for later retrieval, and decompose complex research questions into multiple sub-searches. It can automatically choose between available providers such as Context7, Grok, Tavily, and AnySearch.

## Tools

| Tool | Description |
| --- | --- |
| `web_search` | Search the web and return an answer summary with optional source citations. |
| `web_fetch` | Fetch a URL and extract readable content as Markdown. |
| `get_sources` | Retrieve the cached source list for a previous `web_search` call by `session_id`. |
| `search_planning` | Break a complex question into multiple sub-queries and search them in parallel. |

## Installation

```bash
pi install npm:@lokiyou/pi-web-search
/reload
```

## Configuration

On first load, the extension creates a config template at:

```text
~/.pi/agent/extensions/pi-web-search/config.json
```

Example:

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

| Field | Description |
| --- | --- |
| `provider` | Provider mode: `auto`, `context7`, `grok`, `tavily`, or `anysearch`. |
| `grokApiUrl` | Optional custom Grok-compatible API base URL. |
| `grokApiKey` | xAI API key for Grok-based search and planning. |
| `grokModel` | Optional Grok model override such as `grok-3`. |
| `tavilyApiUrl` | Optional custom Tavily API base URL. |
| `tavilyApiKey` | Tavily API key. |
| `context7ApiKey` | Context7 API key. |
| `anysearchApiKey` | AnySearch API key. |

After updating the config, run `/reload` in Pi.

## Usage notes

- For bilingual queries, use the `query1 | query2` format in the `query` field.
- Use `freshness` to filter for recent results: `day`, `week`, `month`, or `year`.
- Use `domains` to narrow results to a specific topic or content area.
- Set `sources` to `false` when you only want the summary and a `session_id`.
- Call `get_sources(session_id)` later to retrieve the full source list.
- Use `search_planning` for broad or multi-part research questions.

## Examples

Plain-language prompts:

- "Find recent AI infrastructure news from the last week."
- "Extract the readable content from this URL."
- "Compare the latest advances in quantum computing | latest advances in quantum computing."
- "Research the current state of local-first app frameworks."

Tool-style examples:

```text
web_search({ query: "recent AI news", freshness: "week", sources: true })
web_fetch({ url: "https://example.com/article" })
get_sources({ session_id: "abc123" })
search_planning({ goal: "Compare modern vector databases", sub_queries: 4, sources: true })
```

## License

MIT
