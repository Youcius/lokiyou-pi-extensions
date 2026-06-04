# lokiyou-pi-extensions

Monorepo for Pi Coding Agent extensions published under the `@lokiyou` scope.

## Packages

| Package | Summary | Install |
| --- | --- | --- |
| `@lokiyou/pi-web-search` | Unified web search, URL extraction, source caching, and multi-query search planning for Pi Coding Agent. | `pi install npm:@lokiyou/pi-web-search` |
| `@lokiyou/pi-nano-footer` | Lightweight powerline-style footer that shows model, thinking level, directory, MCP status, context usage, tokens, and cost while keeping Pi's built-in `Working...` indicator. | `pi install npm:@lokiyou/pi-nano-footer` |
| `@lokiyou/modelscope-vision` | Vision tools for describing images and answering image questions through the ModelScope API. | `pi install npm:@lokiyou/modelscope-vision` |

## Repository layout

- `packages/pi-web-search` - search extension package
- `packages/pi-nano-footer` - footer extension package
- `packages/modelscope-vision` - vision extension package

## Development

Each package is versioned and published independently.

Typical workflow:

1. Edit the package inside `packages/<name>`.
2. Update the package README and `package.json` metadata if needed.
3. Publish from the package directory.
4. Commit and push the monorepo changes.

See each package README for installation, configuration, and usage details.
