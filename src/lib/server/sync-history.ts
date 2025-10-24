import { kv } from "@vercel/kv";

import type { PlatformKey } from "@/app/dashboard/data";

type SyncSource = "api" | "fallback";

export type SyncHistoryRecord = {
  platform: PlatformKey;
  syncedAt: string;
  source: SyncSource;
};

const SYNC_HISTORY_NAMESPACE = "integration-sync";

const kvAvailable = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN && process.env.KV_REST_API_READ_ONLY_TOKEN
);

const buildKey = (platform: PlatformKey) => `${SYNC_HISTORY_NAMESPACE}:${platform}`;

export class SyncHistoryStore {
  private memory = new Map<PlatformKey, SyncHistoryRecord>();

  async set(record: SyncHistoryRecord) {
    this.memory.set(record.platform, record);

    if (!kvAvailable) return;

    await kv.set(buildKey(record.platform), record);
  }

  async get(platform: PlatformKey): Promise<SyncHistoryRecord | null> {
    const memoryValue = this.memory.get(platform);
    if (memoryValue) return memoryValue;

    if (!kvAvailable) return null;

    const stored = await kv.get<SyncHistoryRecord>(buildKey(platform));
    if (!stored) return null;

    this.memory.set(platform, stored);
    return stored;
  }

  async list(platforms: PlatformKey[]): Promise<Record<PlatformKey, SyncHistoryRecord | null>> {
    const entries = await Promise.all(
      platforms.map(async (platform) => [platform, await this.get(platform)] as const)
    );
    return Object.fromEntries(entries) as Record<PlatformKey, SyncHistoryRecord | null>;
  }
}

export type SyncMetadata = {
  syncedAt: string | null;
  source: SyncSource;
};

export const toSyncMetadata = (record: SyncHistoryRecord | null, fallbackSource: SyncSource = "fallback"): SyncMetadata => {
  if (!record) {
    return { syncedAt: null, source: fallbackSource };
  }

  return { syncedAt: record.syncedAt, source: record.source };
};
