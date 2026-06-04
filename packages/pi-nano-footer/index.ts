/**
 * pi-nano-footer — 超轻量 powerline 风格 footer
 *
 * 精确复刻 pi-powerline-footer default 预设的样式 +
 * 用户自定义霓虹色配色方案。
 */

import type { AssistantMessage } from "@earendil-works/pi-ai";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { truncateToWidth } from "@earendil-works/pi-tui";

// ── Nerd Font 图标（与 pi-powerline-footer 完全一致） ──
const icons = {
  model:   "\uec19",      // nf-md-chip
  mcp:     "\u{f048d}",  // nf-md-server-network
  folder:  "\uf115",      // nf-fa-folder_open
  context: "\ue70f",      // nf-dev-database
  cache:   "\uf1c0",      // nf-fa-database
  input:   "\uf090",      // nf-fa-sign_in
  cost:    "\uf155",      // nf-fa-dollar
  sep:     "\ue0b1",      // powerline-thin
};

// ── 用户自定义霓虹配色 ──
const C = {
  model:           "#ff3cac",
  shellMode:       "#00ff87",
  path:            "#00d4ff",
  gitDirty:        "#ff9f1c",
  gitClean:        "#00ff87",
  thinking:        "#ff6b6b",
  thinkingMinimal: "#a855f7",
  thinkingLow:     "#00d4ff",
  thinkingMedium:  "#ff9f1c",
  context:         "#6c5ce7",
  contextWarn:     "#fdcb6e",
  contextError:    "#ff3366",
  cost:            "#fdcb6e",
  tokens:          "#00ff87",
  separator:       "#a855f7",
  border:          "#dfe6e9",
};

// ── ANSI 24-bit true color 正则（用于从 borderColor 函数提取颜色） ──
const ANSI_RE = /\x1b\[38;2;(\d+);(\d+);(\d+)m/;

// ── Rainbow 色表（high / xhigh 思考等级用） ──
const RAINBOW = [
  "#b281d6", "#d787af", "#febc38", "#e4c00f",
  "#89d281", "#00afaf", "#178fb9", "#b281d6",
];

// ═══════════════════════════════════════════════════════════════════════════
// Extension
// ═══════════════════════════════════════════════════════════════════════════

export default function (pi: ExtensionAPI) {
  let thinkingLevel = "off";
  let requestRender: (() => void) | undefined;
  const refresh = () => requestRender?.();

  pi.on("session_start", async (_event, ctx) => {
    thinkingLevel = pi.getThinkingLevel();
    ctx.ui.setWorkingVisible(true);

    ctx.ui.setFooter((tui, theme, footerData) => {
      requestRender = () => tui.requestRender();
      const unsubBranch = footerData.onBranchChange(() => tui.requestRender());
      let lastStatusSnapshot = snapshotStatuses(footerData);
      const statusPoll = setInterval(() => {
        const nextStatusSnapshot = snapshotStatuses(footerData);
        if (nextStatusSnapshot !== lastStatusSnapshot) {
          lastStatusSnapshot = nextStatusSnapshot;
          tui.requestRender();
        }
      }, 500);
      const clock = setInterval(() => tui.requestRender(), 30_000);

      return {
        dispose() {
          unsubBranch();
          clearInterval(statusPoll);
          clearInterval(clock);
        },
        invalidate() {},
        render(width: number): string[] {
          if (width <= 0) return [];

          // 分隔符：dim 色（低调，不抢眼）
          const S = ` ${theme.fg("dim", icons.sep)} `;
          const parts: string[] = [];

          // 1. 模型 —— #ff3cac 热粉色
          parts.push(ansi(C.model, `${icons.model} ${shorten(ctx.model?.id ?? "–")}`));

          // 2. 思考等级 —— 按等级变色，high/xhigh 彩虹
          parts.push(renderThinkingN(thinkingLevel));

          // 3. 目录 basename —— #00d4ff 青蓝色
          const dir = ctx.cwd.replace(/\\/g, "/").split("/").filter(Boolean).pop() || ctx.cwd;
          parts.push(ansi(C.path, `${icons.folder} ${dir}`));

          // 4. MCP 摘要 —— 紧凑图标版
          const mcp = renderMcpN(footerData);
          if (mcp) parts.push(mcp);

          // 5. 上下文用量 —— #6c5ce7 紫 / #fdcb6e 黄 / #ff3366 红
          parts.push(renderContextN(ctx));

          // 6. Token 用量 —— #00ff87 荧光绿
          const { input, cost } = calcTotals(ctx);
          parts.push(ansi(C.tokens, `${icons.cache} ${icons.input} ${fmt(input)}`));

          // 7. 费用 —— #fdcb6e 明黄色
          parts.push(ansi(C.cost, `${icons.cost} ${cost.toFixed(2)}`));

          return [truncateToWidth(parts.join(S), width, "")];
        },
      };
    });
  });

  // ── 事件订阅 ──

  pi.on("thinking_level_select", (event) => {
    thinkingLevel = event.level;
    refresh();
  });
  pi.on("model_select", () => refresh());
  pi.on("turn_start", () => refresh());
  pi.on("turn_end", () => refresh());

  pi.on("session_shutdown", (_event, ctx) => {
    ctx.ui.setFooter(undefined);
    requestRender = undefined;
  });
}

function snapshotStatuses(footerData: any): string {
  const statuses = footerData?.getExtensionStatuses?.();
  if (!statuses || typeof statuses.entries !== "function") return "";

  return Array.from(statuses.entries())
    .sort(([a], [b]) => String(a).localeCompare(String(b)))
    .map(([key, value]) => `${String(key)}:${stripAnsi(String(value))}`)
    .join("|");
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper 函数
// ═══════════════════════════════════════════════════════════════════════════

function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

/** 16 进制色值 → ANSI 24-bit true color 前景色转义序列 */
function ansi(hex: string, text: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`;
}

/** 渲染思考等级 */
function renderThinkingN(level: string): string {
  const label = level === "minimal" ? "min"
              : level === "medium" ? "med"
              : level;
  const text = `think:${label}`;

  switch (level) {
    case "high":
    case "xhigh":
      return rainbow(text);
    case "minimal":
      return ansi(C.thinkingMinimal, text);
    case "low":
      return ansi(C.thinkingLow, text);
    case "medium":
      return ansi(C.thinkingMedium, text);
    default:
      return ansi(C.thinking, text);
  }
}

/** 渲染上下文用量，带百分比阈值颜色 */
function renderContextN(ctx: any): string {
  const usage = ctx.getContextUsage();
  const pct = usage?.percent;
  const color = pct == null ? C.context
              : pct >= 90 ? C.contextError
              : pct >= 70 ? C.contextWarn
              : C.context;
  const maxStr = ctx.model?.contextWindow
    ? `/${(ctx.model.contextWindow / 1_000_000).toFixed(1)}M`
    : "";
  return ansi(color, `${icons.context} ${pct?.toFixed(1) ?? "?"}%${maxStr}`);
}

/** 渲染 MCP 状态摘要，优先显示已连接/总数 */
function renderMcpN(footerData: any): string | null {
  const statuses = footerData?.getExtensionStatuses?.();
  if (!statuses || typeof statuses.get !== "function") return null;

  const raw = typeof statuses.get("mcp") === "string"
    ? statuses.get("mcp")
    : Array.from(statuses.values()).find((value: unknown) => typeof value === "string" && value.includes("MCP:"));
  if (typeof raw !== "string") return null;

  const status = stripAnsi(raw).replace(/\s+/g, " ").trim();

  const ratio = /MCP:\s*(\d+)\s*\/\s*(\d+)\s+servers?/i.exec(status);
  if (ratio) {
    const connected = Number(ratio[1]);
    const total = Number(ratio[2]);
    const color = connected >= total ? C.tokens : C.thinkingMedium;
    return ansi(color, `${icons.mcp} ${connected}/${total}`);
  }

  const connected = /MCP:\s*(\d+)\s+servers connected(?:\s*\((\d+)\s+tools\))?/i.exec(status);
  if (connected) {
    return ansi(C.tokens, `${icons.mcp} ${connected[1]}`);
  }

  const connecting = /MCP:\s*connecting to\s+(\d+)\s+servers?/i.exec(status);
  if (connecting) {
    return ansi(C.thinkingMedium, `${icons.mcp} …/${connecting[1]}`);
  }

  if (/failed|error|needs-auth|oauth/i.test(status)) {
    return ansi(C.contextError, `${icons.mcp} !`);
  }

  return ansi(C.context, `${icons.mcp} ?`);
}

/** 遍历会话分支，累计 input token 数和总费用 */
function calcTotals(ctx: any): { input: number; cost: number } {
  let input = 0, cost = 0;
  for (const e of ctx.sessionManager.getBranch()) {
    if (e.type === "message" && e.message.role === "assistant") {
      const m = e.message as AssistantMessage;
      input += m.usage.input ?? 0;
      cost += m.usage.cost?.total ?? 0;
    }
  }
  return { input, cost };
}

/** 格式化数字：1.2k / 45M */
function fmt(n: number): string {
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}m`;
}

/** 缩短模型名 */
function shorten(m: string): string {
  return m
    .replace(/^claude-/i, "")
    .replace(/^gpt-/i, "gpt ")
    .replace(/-20\d{6}$/, "")
    .replace(/-latest$/i, "");
}

/** 彩虹渐变 ANSI 渲染 */
function rainbow(text: string): string {
  let out = "", ci = 0;
  for (const ch of text) {
    if (ch === " " || ch === ":") {
      out += ch;
    } else {
      const hex = RAINBOW[ci++ % RAINBOW.length].replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      out += `\x1b[38;2;${r};${g};${b}m${ch}\x1b[0m`;
    }
  }
  return out;
}
