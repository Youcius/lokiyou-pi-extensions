# @lokiyou/pi-nano-footer

Lightweight powerline-style footer for Pi Coding Agent.

This extension replaces the default footer with a compact single-line status bar while keeping Pi's built-in `Working...` indicator. It is designed to stay small and focused.

## Installation

```bash
pi install npm:@lokiyou/pi-nano-footer
/reload
```

## What it shows

From left to right, the footer shows:

- current model
- thinking level
- current directory name
- MCP status summary when MCP status is available
- context usage
- token totals
- estimated cost

## Behavior

- Uses a compact powerline-style separator layout.
- Keeps Pi's built-in `Working...` indicator instead of replacing it.
- Reads MCP status from extension status data when an MCP adapter exposes it.
- Focuses only on the footer and does not replace the editor component.

## Notes

No additional configuration is required.

## License

MIT
