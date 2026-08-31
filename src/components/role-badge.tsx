type RoleSize = "sm" | "md";

interface RoleBadgeProps {
  /** Agent role name — e.g. "Duelist", "Controller", "Initiator", "Sentinel" */
  role: string;
  size?: RoleSize;
  className?: string;
}

const ROLE_STYLES: Record<string, string> = {
  duelist:    "border-role-duelist/40    text-role-duelist    bg-role-duelist/10",
  controller: "border-role-controller/40 text-role-controller bg-role-controller/10",
  initiator:  "border-role-initiator/40  text-role-initiator  bg-role-initiator/10",
  sentinel:   "border-role-sentinel/40   text-role-sentinel   bg-role-sentinel/10",
};

const SIZE_STYLES: Record<RoleSize, string> = {
  sm: "px-2 py-0.5 text-[9px]",
  md: "px-2.5 py-1 text-[10px]",
};

/**
 * Agent role badge with role-specific accent color.
 * Falls back to neutral border/text if role is unrecognised.
 */
export function RoleBadge({ role, size = "md", className }: RoleBadgeProps) {
  const key = role.toLowerCase();
  const colorClass = ROLE_STYLES[key] ?? "border-border text-muted bg-surface";
  return (
    <span
      className={[
        "inline-block border font-mono font-black uppercase tracking-widest",
        SIZE_STYLES[size],
        colorClass,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {role}
    </span>
  );
}
