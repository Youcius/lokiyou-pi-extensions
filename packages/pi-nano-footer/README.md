# @lokiyou/pi-nano-footer

超轻量 powerline 风格 footer for **Pi Coding Agent**。

它保留 Pi 内置的 `Working...` 指示器，同时在底部显示模型、思考等级、目录、上下文、token 和费用，整体走的是清爽、紧凑的霓虹风。

## 安装

```bash
pi install npm:@lokiyou/pi-nano-footer
```

安装后重载 Pi：

```bash
/reload
```

## 展示内容

从左到右依次展示：

- 🤖 模型名
- 💭 思考等级
- 📁 当前目录名
- 📊 上下文用量
- 💾 Token 用量
- 💰 费用

## 风格

- 采用 powerline 分隔符
- 颜色和 `pi-powerline-footer` 的默认 preset 保持一致
- 不替代内置工作状态指示器
- 适合想要简洁 footer、但不想丢掉 Pi 原生反馈的人

## 许可

MIT
