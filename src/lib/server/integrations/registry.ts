import type { PlatformKey } from "@/app/dashboard/data";
import { MetaIntegration } from "./meta";
import { GoogleAdsIntegration } from "./google";
import { TikTokIntegration } from "./tiktok";
import type { IntegrationClient } from "./types";

const registry: Record<PlatformKey, IntegrationClient> = {
  meta: new MetaIntegration(),
  google: new GoogleAdsIntegration(),
  tiktok: new TikTokIntegration(),
};

export const getIntegrationClient = (platform: PlatformKey) => registry[platform];

export const availableIntegrations = Object.values(registry);
