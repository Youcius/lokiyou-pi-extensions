# @lokiyou/pi-nano-footer

超轻量 powerline 风格 footer for **Pi Coding Agent**，霓虹配色方案。

精确复刻 pi-powerline-footer default 预设的样式 + 自定义霓虹色配色。

## 安装

```bash
pi install npm:@lokiyou/pi-nano-footer
```

或手动放入 `~/.pi/agent/extensions/` 后 `/reload`。

## 效果

```
 deepseek-v4-flash  think:high   project   45.2%/128K    1.2k   0.03
```

从左到右依次展示：
- 🤖 **模型名**（热粉色）
- 💭 **思考等级**（按等级变色，high/xhigh 彩虹）
- 📁 **目录名**（青蓝色）
- 📊 **上下文用量**（紫 → 黄 >70% → 红 >90%）
- 💾 **Token 用量**（荧光绿）
- 💰 **费用**（明黄色）

## 配色

| 令牌 | 色值 | 用途 |
|------|------|------|
| 模型 | `#ff3cac` | 热粉 |
| 路径 | `#00d4ff` | 青蓝 |
| thinking | `#ff6b6b` | 珊瑚红 |
| thinking high/xhigh | rainbow | 彩虹渐变 |
| 上下文正常 | `#6c5ce7` | 紫色 |
| 上下文 >70% | `#fdcb6e` | 黄色警告 |
| 上下文 >90% | `#ff3366` | 红色错误 |
| 费用 | `#fdcb6e` | 明黄 |
| tokens | `#00ff87` | 荧光绿 |

## 许可

MIT
