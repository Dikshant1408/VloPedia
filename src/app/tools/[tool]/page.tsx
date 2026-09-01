import { redirect } from "next/navigation";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [
    { tool: "sensitivity" },
    { tool: "sens" },
    { tool: "comp-builder" },
    { tool: "comp" },
    { tool: "comps" },
    { tool: "crosshair" },
    { tool: "crosshairs" },
    { tool: "setup" },
    { tool: "loadout" },
    { tool: "compare" },
    { tool: "what-to-play" },
    { tool: "what-should-i-play" },
  ];
}

interface Props {
  params: Promise<{ tool: string }>;
}

export default async function ToolSubroutePage({ params }: Props) {
  const { tool } = await params;
  const norm = tool.toLowerCase().trim();

  if (norm === "what-to-play" || norm === "what-should-i-play") {
    redirect("/tools/what-to-play");
  }

  if (norm === "sensitivity" || norm === "sens") {
    redirect("/sensitivity");
  }

  if (norm === "comp-builder" || norm === "comp" || norm === "comps") {
    redirect("/comp-builder");
  }

  if (norm === "crosshair" || norm === "crosshairs") {
    redirect("/crosshair");
  }

  if (norm === "setup" || norm === "loadout") {
    redirect("/setup");
  }

  if (norm === "compare") {
    redirect("/compare/weapons/vandal-vs-phantom");
  }

  redirect("/tools");
}
