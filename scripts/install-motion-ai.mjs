import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");
const contentDir = path.join(root, "package/content");

console.log("=== Installing Motion AI Kit ===");

// 1. Copy Motion Skills to .agents/skills/motion, .claude/skills/motion, .cursor/skills/motion
const targetAgentDirs = [
  path.join(root, ".agents/skills/motion"),
  path.join(root, ".claude/skills/motion"),
  path.join(root, ".codex/skills/motion"),
  path.join(os.homedir(), ".gemini/config/skills/motion")
];

const srcSkillDir = path.join(contentDir, "skills/motion");
if (fs.existsSync(srcSkillDir)) {
  for (const dest of targetAgentDirs) {
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(srcSkillDir, dest, { recursive: true });
    console.log(`✓ Copied Motion skill -> ${dest}`);
  }
}

// 2. Copy Cursor Rules
const srcRule = path.join(contentDir, "rules/motion.mdc");
if (fs.existsSync(srcRule)) {
  const destRule = path.join(root, ".cursor/rules/motion.mdc");
  fs.mkdirSync(path.dirname(destRule), { recursive: true });
  fs.copyFileSync(srcRule, destRule);
  console.log(`✓ Copied Motion Cursor rule -> ${destRule}`);
}

// 3. Copy Agent definitions (motion-reviewer)
const srcAgent = path.join(contentDir, "agents/motion-reviewer.md");
if (fs.existsSync(srcAgent)) {
  const claudeAgent = path.join(root, ".claude/agents/motion-reviewer.md");
  fs.mkdirSync(path.dirname(claudeAgent), { recursive: true });
  fs.copyFileSync(srcAgent, claudeAgent);
  console.log(`✓ Copied Motion Reviewer agent -> ${claudeAgent}`);
}

// 4. Configure MCP servers in mcp config if exists or project root
const mcpConfig = {
  mcpServers: {
    motion: {
      type: "http",
      url: "https://mcp.motion.dev"
    },
    "motion-plus": {
      type: "http",
      url: "https://mcp.motion.dev/plus"
    }
  }
};

const mcpDestinations = [
  path.join(root, ".cursor/mcp.json"),
  path.join(os.homedir(), ".gemini/antigravity-ide/mcp_config.json")
];

for (const dest of mcpDestinations) {
  try {
    let existing = {};
    if (fs.existsSync(dest)) {
      existing = JSON.parse(fs.readFileSync(dest, "utf-8"));
    }
    existing.mcpServers = existing.mcpServers || {};
    existing.mcpServers["motion"] = mcpConfig.mcpServers["motion"];
    existing.mcpServers["motion-plus"] = mcpConfig.mcpServers["motion-plus"];
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, JSON.stringify(existing, null, 2), "utf-8");
    console.log(`✓ Configured Motion MCP servers -> ${dest}`);
  } catch (e) {
    console.warn(`Could not update MCP for ${dest}:`, e.message);
  }
}

console.log("\n=== Motion AI Kit Installation Complete! ===");
