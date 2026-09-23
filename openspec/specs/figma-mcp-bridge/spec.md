# figma-mcp-bridge Specification

## Purpose
Provides a local, rate-limit-free bridge between the Figma desktop application and AI coding assistants via Model Context Protocol (MCP), enabling zero-cloud design inspection and asset extraction.

## Requirements

### Requirement: Local Figma Bridge MCP Server Configuration
The system SHALL configure `figma-mcp-bridge` as an active MCP server in project and global agent configuration, replacing legacy cloud-polling servers (`figma-developer-mcp`).

#### Scenario: Agent initializes MCP connection
- **WHEN** the agent or IDE boots up and loads available MCP servers
- **THEN** it executes `figma-mcp-bridge` without requiring an active cloud REST API Personal Access Token or cloud API quota

### Requirement: Live Document Inspection via Desktop Bridge
The system SHALL support inspecting live Figma file node structures, text layers, styling tokens, and layout trees through the local Figma companion plugin connection.

#### Scenario: Inspecting a specific frame by node ID
- **WHEN** an AI assistant or developer queries a Figma node ID (e.g. `79:827`)
- **THEN** the bridge retrieves the node hierarchy, dimensions, and typography directly from the running Figma session without triggering HTTP 429 rate limit errors

### Requirement: Deprecation and Clean Removal of Legacy Figma Server
The system SHALL eliminate all obsolete references, token keys, and schemas associated with `figma-developer-mcp` across configuration files.

#### Scenario: Verifying configuration cleanliness
- **WHEN** inspecting `.agent/mcp_config.json`, `.cursor/mcp.json`, and `~/.gemini/config/mcp_config.json`
- **THEN** no references or rate-limited API keys for `figma-developer-mcp` remain active in the configuration files
