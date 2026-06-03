/**
 * modelscope-vision — Pi Coding Agent Extension
 *
 * Registers two vision-understanding tools (vision-describe, vision-ask)
 * that call ModelScope's OpenAI-compatible /v1/chat/completions API.
 * Slash-command configuration for API key and model.
 *
 * Installation:
 *   pi install npm:modelscope-vision
 *   # Then set your API key:
 *   /modelscope-vision key
 *
 * The underlying `vision` MCP server is also available, but this extension
 * lets you configure model/key independently and works without MCP.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

// ──────────────── Config ────────────────

interface Config {
  model: string;
  apiKey: string;
  baseUrl: string;
}

const DEFAULT_CONFIG: Config = {
  model: "",
  apiKey: "",
  baseUrl: "https://api-inference.modelscope.cn/v1",
};

function configDir(): string {
  const home = process.env.HOME || process.env.USERPROFILE || "";
  return path.join(home, ".pi", "agent", "extensions", "modelscope-vision");
}

function configPath(): string {
  return path.join(configDir(), "config.json");
}

function loadConfig(): Config {
  try {
    const raw = fs.readFileSync(configPath(), "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

function saveConfig(cfg: Config): void {
  const dir = configDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(configPath(), JSON.stringify(cfg, null, 2), "utf-8");
}

// ──────────────── Image helpers ────────────────

const MIME_MAP: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".bmp": "image/bmp",
};

function mimeFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_MAP[ext] || "image/jpeg";
}

/**
 * Build the `content` array for the messages payload.
 * If image_path is provided, reads the file and base64-encodes it.
 */
function buildContent(text: string, params: {
  image_url?: string;
  image_path?: string;
}): Array<{ type: string; text?: string; image_url?: { url: string } }> {
  const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];

  content.push({ type: "text", text });

  if (params.image_url) {
    content.push({ type: "image_url", image_url: { url: params.image_url } });
  } else if (params.image_path) {
    const absPath = path.resolve(params.image_path);
    const raw = fs.readFileSync(absPath);
    const b64 = raw.toString("base64");
    const mime = mimeFromPath(absPath);
    content.push({ type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } });
  }

  return content;
}

// ──────────────── API call ────────────────

async function callVisionAPI(config: Config, content: Array<{ type: string; text?: string; image_url?: { url: string } }>) {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content }],
      max_tokens: 2048,
    }),
  });

  const body: any = await response.json();

  if (!response.ok) {
    throw new Error(`ModelScope API error (${response.status}): ${body.error?.message || JSON.stringify(body)}`);
  }

  return body;
}

// ──────────────── Extension entry point ────────────────

export default function (pi: ExtensionAPI) {
  // ─── Slash command ───
  pi.registerCommand("modelscope-vision", {
    description: "Configure ModelScope Vision — usage: /modelscope-vision [model|key|base-url|config]",
    getArgumentCompletions: (prefix: string) => {
      const subs = ["model", "key", "base-url", "config"];
      const filtered = subs.filter((s) => s.startsWith(prefix));
      return filtered.length > 0 ? filtered.map((s) => ({ value: s, label: s })) : null;
    },
    handler: async (args, ctx) => {
      const parts = args.trim().split(/\s+/);
      const sub = parts[0]?.toLowerCase();
      const val = parts.slice(1).join(" ");

      switch (sub) {
        case "model": {
          const cur = loadConfig();
          const answer = val || await ctx.ui.input("ModelScope model ID:", cur.model);
          if (answer) {
            cur.model = answer;
            saveConfig(cur);
            ctx.ui.notify(`✅ Model set to: ${answer}`, "info");
          }
          break;
        }
        case "key": {
          const answer = await ctx.ui.input("ModelScope API key (access token):", "");
          if (answer) {
            const cur = loadConfig();
            cur.apiKey = answer;
            saveConfig(cur);
            ctx.ui.notify("✅ API key saved — stored securely in config file", "info");
          }
          break;
        }
        case "base-url": {
          const cur = loadConfig();
          const answer = val || await ctx.ui.input("API base URL:", cur.baseUrl);
          if (answer) {
            cur.baseUrl = answer;
            saveConfig(cur);
            ctx.ui.notify(`✅ Base URL set to: ${answer}`, "info");
          }
          break;
        }
        default: {
          // Also handles "config" or bare "/modelscope-vision"
          const cur = loadConfig();
          const masked = cur.apiKey
            ? `${cur.apiKey.slice(0, 4)}…${cur.apiKey.slice(-4)}`
            : "❌ not set";
          ctx.ui.notify(
            [
              `📋 Model:    ${cur.model}`,
              `🔗 Base URL: ${cur.baseUrl}`,
              `🔑 API key:  ${masked}`,
            ].join("\n"),
            "info",
          );
        }
      }
    },
  });

  // ─── Tool: vision-describe ───
  pi.registerTool({
    name: "vision-describe",
    label: "Vision Describe",
    description:
      "Describe an image using the configured ModelScope vision model. " +
      "Provide image_url (public URL) or image_path (local file). " +
      "Optionally set a custom prompt and language (zh / en). " +
      "Requires API key configured via /modelscope-vision key.",
    parameters: Type.Object({
      image_url: Type.Optional(Type.String({ description: "Public URL of the image" })),
      image_path: Type.Optional(Type.String({ description: "Absolute path to a local image file" })),
      prompt: Type.Optional(Type.String({ description: "Custom description prompt (default: describe in detail)" })),
      language: Type.Optional(Type.String({ description: "'zh' for Chinese, 'en' for English (default: en)" })),
    }),
    promptSnippet: "vision: describe or understand image content",
    promptGuidelines: [
      "- Use vision-describe when the user wants a detailed description, mood, or general understanding of an image.",
    ],

    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const config = loadConfig();
      if (!config.apiKey) {
        return {
          content: [{ type: "text", text: "Error: ModelScope API key not configured. Run /modelscope-vision key to set it." }],
          details: { error: "API key not configured" },
        };
      }
      if (!config.model) {
        return {
          content: [{ type: "text", text: "Error: No vision model configured. Run /modelscope-vision model to set one." }],
          details: { error: "Model not configured" },
        };
      }

      if (!params.image_url && !params.image_path) {
        return {
          content: [{ type: "text", text: "Error: Provide either image_url (public URL) or image_path (local file)." }],
          details: { error: "No image source" },
        };
      }

      try {
        let prompt = params.prompt || "Please describe this image in detail. What do you see?";
        if (params.language === "zh") {
          prompt = "请详细描述这张图片的内容。";
        }

        const content = buildContent(prompt, {
          image_url: params.image_url,
          image_path: params.image_path,
        });

        const data = await callVisionAPI(config, content);
        const description = data.choices?.[0]?.message?.content || "No description returned.";

        return {
          content: [{ type: "text", text: description }],
          details: { model: config.model, usage: data.usage || {} },
        };
      } catch (err: any) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          details: { error: err.message || String(err) },
        };
      }
    },

  });

  // ─── Tool: vision-ask ───
  pi.registerTool({
    name: "vision-ask",
    label: "Vision Ask",
    description:
      "Ask a specific question about an image using the configured ModelScope vision model. " +
      "Provide image_url (public URL) or image_path (local file). " +
      "Requires API key configured via /modelscope-vision key.",
    parameters: Type.Object({
      image_url: Type.Optional(Type.String({ description: "Public URL of the image" })),
      image_path: Type.Optional(Type.String({ description: "Absolute path to a local image file" })),
      question: Type.String({ description: "The question to ask about the image" }),
    }),
    promptSnippet: "vision: ask a question about an image",
    promptGuidelines: [
      "- Use vision-ask when the user has a specific question about an image (e.g. 'what breed is this dog?', 'how many people?').",
    ],

    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const config = loadConfig();
      if (!config.apiKey) {
        return {
          content: [{ type: "text", text: "Error: ModelScope API key not configured. Run /modelscope-vision key to set it." }],
          details: { error: "API key not configured" },
        };
      }
      if (!config.model) {
        return {
          content: [{ type: "text", text: "Error: No vision model configured. Run /modelscope-vision model to set one." }],
          details: { error: "Model not configured" },
        };
      }

      if (!params.image_url && !params.image_path) {
        return {
          content: [{ type: "text", text: "Error: Provide either image_url (public URL) or image_path (local file)." }],
          details: { error: "No image source" },
        };
      }

      try {
        const content = buildContent(params.question, {
          image_url: params.image_url,
          image_path: params.image_path,
        });

        const data = await callVisionAPI(config, content);
        const answer = data.choices?.[0]?.message?.content || "No answer returned.";

        return {
          content: [{ type: "text", text: answer }],
          details: { model: config.model, question: params.question, usage: data.usage || {} },
        };
      } catch (err: any) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          details: { error: err.message || String(err) },
        };
      }
    },

  });
}
