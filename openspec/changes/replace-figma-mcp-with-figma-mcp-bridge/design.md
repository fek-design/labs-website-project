## Context

See `proposal.md` for motivation. Currently, `.agent/mcp_config.json`, `.cursor/mcp.json`, and global `~/.gemini/config/mcp_config.json` configure `figma-developer-mcp` using a cloud REST API Personal Access Token (`FIGMA_API_KEY`). On Figma Free/Starter tiers, API access is limited to a small monthly quota, triggering HTTP 429 rate limit lockouts that block design token extraction.

`figma-mcp-bridge` (developed by `gethopp`) eliminates this cloud API dependency by running a local WebSocket bridge between a Figma desktop plugin and an MCP stdio server. This design document establishes the replacement architecture, configuration structure, and migration steps.

## Goals / Non-Goals

**Goals:**
- Completely remove `figma-developer-mcp` from `.agent/mcp_config.json`, `.cursor/mcp.json`, and `~/.gemini/config/mcp_config.json`.
- Configure `figma-mcp-bridge` as the authoritative Figma MCP server.
- Support querying live canvas node trees, layouts, colors, and typography directly from an active Figma file session.
- Document clear companion plugin setup instructions for developers.

**Non-Goals:**
- Modifying Next.js web application code (`app/`, `components/`, `lib/`, `prisma/`).
- Re-architecting other MCP servers.

## Decisions

### 1. Configuration of `@gethopp/figma-mcp-bridge`
- **Choice**: Register `figma-mcp-bridge` in `.agent/mcp_config.json` and `.cursor/mcp.json`:
  ```json
  {
    "mcpServers": {
      "figma-bridge": {
        "command": "npx",
        "args": [
          "-y",
          "@gethopp/figma-mcp-bridge"
        ]
      }
    }
  }
  ```
- **Rationale**: No API key or authentication tokens are required in environment variables. The server communicates directly over a local port/stdio channel with the Figma desktop client.
- **Alternatives Considered**:
  - Keeping `figma-developer-mcp` with paid Figma seat: Rejected due to recurring costs and cloud dependency violations.

### 2. Companion Plugin Workflow
- **Choice**: The developer installs the companion plugin from `https://github.com/gethopp/figma-mcp-bridge` via Figma Desktop (`Plugins > Development > Import plugin from manifest...`).
- **Rationale**: The plugin runs in the Figma sandbox and reads the active file DOM directly, bypassing external REST API quotas completely.

### 3. Synchronization Across IDE Configuration Roots
- **Choice**: Update `.agent/mcp_config.json`, `.cursor/mcp.json`, and `~/.gemini/config/mcp_config.json` simultaneously.
- **Rationale**: Ensures both Cursor and Antigravity IDE pick up the new server without configuration mismatch.

## Risks / Trade-offs

- **[Risk] Companion plugin not active in Figma desktop client**:
  - **Mitigation**: The MCP server reports clear connection status when queried. When Figma is closed or the plugin is inactive, the agent will gracefully fall back to local snapshots in `openspec/mockups/` or prompt the user to start the plugin.
