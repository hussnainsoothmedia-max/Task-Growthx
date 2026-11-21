import type { APIRoute } from "astro";
import { MCP_SERVER, MCP_TOOLS } from "../../../data/mcp";
import { BUSINESS, SITE_URL } from "../../../data/site";

// Served at /.well-known/mcp/server-card.json (MCP Server Card, SEP-1649).
// Astro skips folders that start with a dot, so the path comes from a param.
export function getStaticPaths() {
  return [{ params: { wellknown: ".well-known" } }];
}

export const GET: APIRoute = () => {
  const card = {
    version: "1.0",
    protocolVersion: MCP_SERVER.protocolVersion,
    serverInfo: {
      name: MCP_SERVER.name,
      title: MCP_SERVER.title,
      version: MCP_SERVER.version,
    },
    description: BUSINESS.description,
    iconUrl: BUSINESS.logo,
    documentationUrl: `${SITE_URL}/llms.txt`,
    transport: {
      type: "streamable-http",
      endpoint: MCP_SERVER.endpoint,
    },
    capabilities: {
      tools: { listChanged: false },
    },
    authentication: { required: false, schemes: [] },
    instructions: MCP_SERVER.instructions,
    tools: MCP_TOOLS,
  };
  return new Response(JSON.stringify(card, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
