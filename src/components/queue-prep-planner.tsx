"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  type FirestoreQueuePrepPlan,
  type QueuePrepPlanInput,
  normalizeQueuePrepNotes,
  normalizeQueuePrepText,
  type QueuePrepStatus
} from "@/lib/firestore-queue-prep";
import { cn } from "@/lib/utils";
import { CircleDot, Clock3, Trash2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

const statusLabels: Record<QueuePrepStatus, string> = {
  draft: "Draft",
  ready: "Ready",
  archived: "Archived"
};

const statusStyles: Record<QueuePrepStatus, string> = {
  draft: "border-secondary/30 bg-secondary/10 text-blue-100",
  ready: "border-green/30 bg-green/10 text-green-100",
  archived: "border-white/10 bg-white/5 text-muted"
};

const mapOptions = ["Any map", "Ascent", "Bind", "Haven", "Lotus", "Split", "Sunset"];
const modeOptions = ["Competitive", "Premier", "Swiftplay", "Deathmatch"];
const roleOptions = ["Flex", "Duelist", "Controller", "Initiator", "Sentinel"];

type QueuePrepPlannerProps = {
  plans: FirestoreQueuePrepPlan[];
  loading: boolean;
  error: string | null;
  addQueuePrepPlan: (input: QueuePrepPlanInput) => Promise<void>;
  updateQueuePrepStatus: (planId: string, status: QueuePrepStatus) => Promise<void>;
  removeQueuePrepPlan: (planId: string) => Promise<void>;
};

export function QueuePrepPlanner({
  plans,
  loading,
  error,
  addQueuePrepPlan,
  updateQueuePrepStatus,
  removeQueuePrepPlan
}: QueuePrepPlannerProps) {
  const [title, setTitle] = useState("");
  const [mapName, setMapName] = useState("Any map");
  const [mode, setMode] = useState("Competitive");
  const [agentRole, setAgentRole] = useState("Flex");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const readyCount = useMemo(() => plans.filter((plan) => plan.status === "ready").length, [plans]);

  async function handleCreatePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = normalizeQueuePrepText(title);
    const normalizedNotes = normalizeQueuePrepNotes(notes);

    if (normalizedTitle.length < 3) {
      toast.error("Name this queue prep plan.");
      return;
    }

    if (normalizedNotes.length < 5) {
      toast.error("Add a short prep note.");
      return;
    }

    setSubmitting(true);

    try {
      await addQueuePrepPlan({
        title: normalizedTitle,
        mapName,
        mode,
        agentRole,
        notes: normalizedNotes
      });
      setTitle("");
      setNotes("");
      setMapName("Any map");
      setMode("Competitive");
      setAgentRole("Flex");
      toast.success("Queue prep saved.");
    } catch {
      toast.error("Could not save that plan.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(planId: string, status: QueuePrepStatus) {
    try {
      await updateQueuePrepStatus(planId, status);
      toast.success(`Plan marked ${statusLabels[status].toLowerCase()}.`);
    } catch {
      toast.error("Could not update that plan.");
    }
  }

  async function handleDeletePlan(planId: string) {
    try {
      await removeQueuePrepPlan(planId);
      toast.success("Queue prep removed.");
    } catch {
      toast.error("Could not remove that plan.");
    }
  }

  return (
    <Card className="space-y-6 border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] lg:col-span-2">
      <div className="grid gap-5 border-b border-border pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Badge className="border-primary/30 bg-primary-soft text-primary">Queue prep</Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Build a pre-match plan before you queue.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Save map intent, role, mode, and reminders so your dashboard becomes useful before the match starts.
          </p>
        </div>
        <div className="border border-[rgba(236,232,225,0.08)] bg-[#08111A] px-5 py-4">
          <p className="text-3xl font-semibold text-foreground">{readyCount}</p>
          <p className="text-sm text-muted">ready plans</p>
        </div>
      </div>

      <form className="grid gap-4 xl:grid-cols-[1fr_0.8fr_0.8fr_0.8fr] xl:items-end" onSubmit={handleCreatePlan}>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Plan name</span>
          <input
            className="w-full border border-[rgba(236,232,225,0.08)] bg-[#08111A] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary"
            maxLength={72}
            placeholder="Sunset ranked warmup"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <SelectField label="Map" value={mapName} values={mapOptions} onChange={setMapName} />
        <SelectField label="Mode" value={mode} values={modeOptions} onChange={setMode} />
        <SelectField label="Role" value={agentRole} values={roleOptions} onChange={setAgentRole} />

        <label className="space-y-2 xl:col-span-3">
          <span className="text-sm font-medium text-foreground">Prep note</span>
          <input
            className="w-full border border-[rgba(236,232,225,0.08)] bg-[#08111A] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary"
            maxLength={360}
            placeholder="Play early mid info, check bonus economy, keep one smoke for retake."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>
        <Button className="w-full xl:w-auto" disabled={submitting} type="submit">
          {submitting ? "Saving..." : "Save prep"}
        </Button>
      </form>

      <div className="grid gap-4 lg:grid-cols-2">
        {loading ? (
          <QueuePrepState icon={Clock3} text="Loading queue prep plans..." />
        ) : error ? (
          <div className="border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-200">{error}</div>
        ) : plans.length === 0 ? (
          <QueuePrepState icon={CircleDot} text="No queue prep plans yet. Add one to make this dashboard practical before your next match." />
        ) : (
          plans.map((plan) => (
            <article key={plan.id} className="border border-[rgba(236,232,225,0.08)] bg-[#08111A] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{plan.title}</h3>
                    <span className={cn("border px-2.5 py-1 text-xs", statusStyles[plan.status])}>{statusLabels[plan.status]}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{plan.mapName} / {plan.mode} / {plan.agentRole}</p>
                </div>
                <button
                  aria-label={`Remove ${plan.title}`}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-background text-muted transition-colors hover:bg-surface hover:text-foreground"
                  type="button"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">{plan.notes}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(["draft", "ready", "archived"] as const).map((status) => (
                  <button
                    key={status}
                    className={cn(
                      "border border-border px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground",
                      plan.status === status && "border-primary/40 bg-primary-soft text-foreground"
                    )}
                    type="button"
                    onClick={() => handleStatusChange(plan.id, status)}
                  >
                    {statusLabels[status]}
                  </button>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}

function SelectField({
  label,
  value,
  values,
  onChange
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select
        className="w-full border border-[rgba(236,232,225,0.08)] bg-[#08111A] px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}

function QueuePrepState({ icon: Icon, text }: { icon: typeof Clock3; text: string }) {
  return (
    <div className="border border-[rgba(236,232,225,0.08)] bg-[#08111A] px-4 py-4 text-sm text-muted">
      <Icon className="mb-3 h-5 w-5 text-primary" />
      {text}
    </div>
  );
}
