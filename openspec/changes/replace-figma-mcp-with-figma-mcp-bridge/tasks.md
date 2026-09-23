## 1. Remove Legacy Figma MCP Configuration

- [x] 1.1 Remove `figma-developer-mcp` configuration and expired API tokens from `.agent/mcp_config.json`.
- [x] 1.2 Remove `figma-developer-mcp` configuration and expired API tokens from `.cursor/mcp.json`.
- [x] 1.3 Remove `figma-developer-mcp` configuration and expired API tokens from `~/.gemini/config/mcp_config.json`.

## 2. Configure figma-mcp-bridge

- [x] 2.1 Register `figma-bridge` (`npx -y @gethopp/figma-mcp-bridge`) in `.agent/mcp_config.json`.
- [x] 2.2 Register `figma-bridge` (`npx -y @gethopp/figma-mcp-bridge`) in `.cursor/mcp.json`.
- [x] 2.3 Register `figma-bridge` (`npx -y @gethopp/figma-mcp-bridge`) in `~/.gemini/config/mcp_config.json`.

## 3. Documentation & OpenSpec Validation

- [x] 3.1 Document the companion Figma plugin setup steps (importing manifest from `gethopp/figma-mcp-bridge`) in `docs/figma-mcp-bridge.md`.
- [x] 3.2 Run `openspec validate "replace-figma-mcp-with-figma-mcp-bridge" --strict` to verify full specification compliance.
