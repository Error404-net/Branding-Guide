# error404-brand-mcp

An MCP server that makes the Error404 brand system queryable by AI agents, so
being on-brand is something a tool can check rather than something a person has
to remember.

It reads `BRAND.md`, `DESIGN.md` and `styleguide/src/tokens.css` **at call
time**. There is no embedded copy of the brand data, so the server can never
drift from the committed specs — edit the spec, and the answers change.

## Install

    cd brand-mcp
    npm install
    npm test        # 29 assertions, exercises every tool

## Connect it

Point `ERROR404_BRAND_ROOT` at the repository checkout.

**Claude Code / Cowork** — `.mcp.json` in the repo root, or your user config:

```json
{
  "mcpServers": {
    "error404-brand": {
      "command": "node",
      "args": ["./brand-mcp/src/index.js"],
      "env": { "ERROR404_BRAND_ROOT": "." }
    }
  }
}
```

**Claude Desktop** — `claude_desktop_config.json`, using absolute paths:

```json
{
  "mcpServers": {
    "error404-brand": {
      "command": "node",
      "args": ["/Users/<you>/GitHub/Branding-Guide/brand-mcp/src/index.js"],
      "env": { "ERROR404_BRAND_ROOT": "/Users/<you>/GitHub/Branding-Guide" }
    }
  }
}
```

If the root is wrong, every tool returns one clear error naming the path it
tried, rather than answering from stale defaults.

## Tools

| Tool | Use it for |
|---|---|
| `brand_context` | The compact brief. Call this **first**, before producing anything branded |
| `brand_tokens` | Canonical token values parsed from `tokens.css`, optionally filtered |
| `brand_section` | Any section of `BRAND.md` or `DESIGN.md`, verbatim |
| `check_contrast` | WCAG 2.1 ratio and pass/fail for a colour pair. Accepts hex or token names |
| `review_copy` | Lint copy against the fixed terminology, the STE rules, the voice rule, and stray contact details |
| `pick_mode` | Decide Digital vs Print/Corporate for a described surface |

## In practice

> "Write the intro copy for the templates page, then check it with the brand
> tools."

The agent calls `brand_context`, drafts, then `review_copy`, and fixes what
comes back before showing you anything.

> "Is `#FF5FA2` on `#1C1044` readable for body text?"

`check_contrast` → 6.14:1, AA. Passes, but not AAA.

> "I'm writing a status report for a client."

`pick_mode` → Print/Corporate, with the reason and what to apply.

## What `review_copy` catches

Terminology drift (`colorway` → `variant`, `logo` → `mark` or `wordmark`, the
bare `404.NET` → `ERROR404.NET`), sentences over 25 words, em-dash chains,
second-person address in published copy, likely passive voice, filler words,
real email addresses or phone numbers leaking into template text, and the
locked tagline placed where it reads as an email-signature sign-off (BRAND.md
carves the tagline out of the signature specifically — see "Tagline &
Slogans").

Findings are graded `error` / `warn` / `info`. Only `error` fails the check.
Terminology and contact-detail findings are reliable; the sentence, voice and
passive findings are heuristics that need human judgement, and the tool says so
in its own output.

Pass `context: "flavour"` for the tagline, easter eggs, and deliberate
in-voice copy — those are exempt from the STE and voice rules by design.

### On false positives

The linter deliberately does **not** fire on:

- `Print/Corporate mode` — the banned string `corporate mode` is a substring of
  the correct term.
- `banner logo`, `square logo` — Entra and M365 field names, not our vocabulary.
- `the Office theme file`, `the Discord client theme` — real artefacts, not the
  palette.
- `error404.net`, `ERROR404.NET` — the correct wordmark/domain forms. Only the
  bare `404.NET` (missing "ERROR") is flagged.

Each of those is covered by a regression test. A linter that flags correct copy
gets switched off, which is worse than not having one.

## Extending it

Add a tool in `src/index.js` with `server.registerTool`, and add assertions to
`test/smoke.js`. Keep reading from the spec files rather than hardcoding brand
values — the moment this server holds its own copy of the palette, it becomes
one more thing that can silently disagree with `BRAND.md`.
