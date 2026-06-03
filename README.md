# lokiyou-pi-extensions

Lokiyou 的 Pi 扩展 Monorepo，统一收纳并维护 3 个公开发布的扩展包。

## 包一览

| 包 | 用途 | 安装 |
|---|---|---|
| `packages/pi-web-search` | `web_search` / `web_fetch` / `get_sources` / `search_planning`，支持双语搜索、来源缓存、复杂查询拆分 | `pi install npm:@lokiyou/pi-web-search` |
| `packages/pi-nano-footer` | 轻量 powerline footer，显示模型、思考等级、目录、上下文、token、费用，并保留 Pi 内置 `Working...` 指示器 | `pi install npm:@lokiyou/pi-nano-footer` |
| `packages/modelscope-vision` | 通过 ModelScope API 提供图片理解能力，支持 `vision-describe` 和 `vision-ask` | `pi install npm:@lokiyou/modelscope-vision` |

## 开发说明

- 每个包都可以独立发布到 npm。
- `packages/*` 下的 README 是各自的使用说明与配置说明。
- 若要本地开发，直接进入对应目录修改并重新发布即可。
