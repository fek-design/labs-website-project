# Figma MCP Bridge Setup Guide

This project uses [`figma-mcp-bridge`](https://github.com/gethopp/figma-mcp-bridge) (built by `gethopp`) to connect AI assistants and local tools directly to active Figma design files.

## Why Figma MCP Bridge?

The official Figma REST API enforces strict monthly rate limits on Starter/Free plans (HTTP `429 Rate limit exceeded`), which can lock developers out of design token extraction for days. 

`figma-mcp-bridge` replaces cloud API polling with a **local WebSocket bridge** connecting an in-Figma companion plugin directly to a local MCP server.

### Key Benefits
- **Zero API Rate Limits**: Operates directly within your running Figma desktop session.
- **Zero Cloud / Subscription Requirement**: Works with Free/Starter Figma accounts.
- **Real-Time Data**: Queries the exact live state of the open Figma document.
- **Zero API Keys in Config**: No need to manage or leak Personal Access Tokens (`FIGMA_API_KEY`).

---

## MCP Server Configuration

The MCP server is registered in `.agent/mcp_config.json`, `.cursor/mcp.json`, and `~/.gemini/config/mcp_config.json`:

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

---

## Companion Plugin Installation (Figma Desktop)

To enable live inspection between the MCP server and Figma, install and run the companion Figma plugin:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gethopp/figma-mcp-bridge.git ~/figma-mcp-bridge
   cd ~/figma-mcp-bridge
   npm install
   npm run build
   ```

2. **Import into Figma**:
   - Open the **Figma Desktop app**.
   - Open any design file (or your team's project, e.g., `Zealand-Labs-Projekt`).
   - Open the menu: **Plugins** > **Development** > **Import plugin from manifest...**.
   - Browse to `~/figma-mcp-bridge/manifest.json` and click **Open**.

3. **Run the Plugin**:
   - In Figma, right-click on the canvas or press `Cmd + /` (or `Ctrl + /`), type **Figma MCP Bridge**, and press Enter.
   - The plugin UI will display the connection status (e.g. `Connected to localhost`).

4. **Query Designs in your AI IDE**:
   - When the plugin is running, the AI agent can query document nodes, layout frames, typography, and vectors in real-time through the `figma-bridge` tools without hitting Figma API limits.
