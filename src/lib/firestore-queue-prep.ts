export const queuePrepStatuses = ["draft", "ready", "archived"] as const;

export type QueuePrepStatus = (typeof queuePrepStatuses)[number];

export type FirestoreQueuePrepPlan = {
  id: string;
  title: string;
  mapName: string;
  mode: string;
  agentRole: string;
  status: QueuePrepStatus;
  notes: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type QueuePrepPlanInput = {
  title: string;
  mapName: string;
  mode: string;
  agentRole: string;
  notes: string;
};

export function normalizeQueuePrepText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeQueuePrepNotes(value: string) {
  return value.trim().replace(/\s+/g, " ");
}
