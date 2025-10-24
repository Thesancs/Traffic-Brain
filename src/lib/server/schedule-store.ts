import { kv } from "@vercel/kv";

const SCHEDULE_KEY = "integration-sync-schedule";

const DEFAULT_SCHEDULE: SyncSchedule = {
  frequency: "custom",
  cron: "0 */2 * * *",
  timezone: "UTC",
};

const kvAvailable = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN && process.env.KV_REST_API_READ_ONLY_TOKEN
);

type SyncSchedule = {
  frequency: "hourly" | "daily" | "custom";
  cron?: string;
  timezone?: string;
};

let memorySchedule: SyncSchedule | null = null;

export const getSchedule = async (): Promise<SyncSchedule> => {
  if (kvAvailable) {
    const stored = await kv.get<SyncSchedule>(SCHEDULE_KEY);
    if (stored) return stored;
  }
  return memorySchedule ?? DEFAULT_SCHEDULE;
};

export const setSchedule = async (schedule: SyncSchedule) => {
  if (kvAvailable) {
    await kv.set(SCHEDULE_KEY, schedule);
  }
  memorySchedule = schedule;
};
