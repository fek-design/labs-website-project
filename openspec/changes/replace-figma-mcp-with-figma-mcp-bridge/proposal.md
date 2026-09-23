## Why

The current Figma MCP configuration uses `figma-developer-mcp` with a direct Figma REST API Personal Access Token. This approach relies on cloud REST API endpoints (`api.figma.com`) that are heavily restricted by Figma's monthly Starter/Free tier rate limits (resulting in HTTP `429 Rate limit exceeded` errors that lock development out for days). 

Replacing `figma-developer-mcp` with `figma-mcp-bridge` (built by `gethopp`) provides a local, real-time bridge via a lightweight Figma desktop plugin and local MCP server. This allows AI assistants and developers to inspect design files, document trees, and visual assets directly from the active Figma canvas with zero cloud API rate limits, no paid seat requirement, and complete adherence to the project's local development workflow.

## What Changes

- **Deprecate and Remove `figma-developer-mcp`**:
  - Remove `figma-developer-mcp` configuration blocks from workspace configuration (`.agent/mcp_config.json`, `.cursor/mcp.json`) and global agent configuration (`~/.gemini/config/mcp_config.json`).
  - Clear out deprecated schemas and unused tool references from the IDE app data directory (`~/.gemini/antigravity-ide/mcp/figma-developer-mcp/`).
- **Install and Configure `figma-mcp-bridge` (by `gethopp`)**:
  - Configure the MCP server entry in `.agent/mcp_config.json` and `.cursor/mcp.json` using `npx -y @gethopp/figma-mcp-bridge` (or package equivalent).
  - Document setup steps for connecting the local companion Figma plugin in the workspace.
  - Expose tools for reading canvas nodes, document structure, and visual exports directly through the bridge.
- **Update Documentation & Speckit Contracts**:
  - Update `openspec/config.yaml` and developer guides to reflect `figma-mcp-bridge` tool conventions.

## Capabilities

### New Capabilities
- `figma-mcp-bridge`: Local websocket-based bridge between the running Figma desktop app and the AI MCP agent, bypassing cloud API rate limits and providing real-time canvas inspection.

### Modified Capabilities
<!-- None: No existing runtime application specifications or user-facing product requirements are modified -->

## Impact

- **Configuration Files**:
  - `.agent/mcp_config.json`
  - `.cursor/mcp.json`
  - `~/.gemini/config/mcp_config.json`
- **Tooling & Workflows**:
  - Figma inspection commands switch from REST API polling with `FIGMA_API_KEY` to local bridge communication.
  - Zero disruption to application source code (`app/`, `components/`, `lib/`).
