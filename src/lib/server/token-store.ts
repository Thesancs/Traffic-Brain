import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { kv } from "@vercel/kv";
import type { PlatformKey } from "@/app/dashboard/data";
import type { OAuthTokenPayload } from "./integrations/types";

const TOKEN_NAMESPACE = "integration-token";
const ALGORITHM = "aes-256-gcm";

export type StoredTokenRecord = {
  platform: PlatformKey;
  identifier: string;
  token: OAuthTokenPayload;
  metadata?: Record<string, string>;
};

const encodeKey = (platform: PlatformKey, identifier: string) =>
  `${TOKEN_NAMESPACE}:${platform}:${identifier}`;

const getEncryptionKey = () => {
  const secret = process.env.INTEGRATIONS_ENCRYPTION_KEY;
  if (!secret) return null;
  try {
    const buffer = Buffer.from(secret, "base64");
    if (buffer.length !== 32) {
      throw new Error("A chave de criptografia deve ter 32 bytes em base64.");
    }
    return buffer;
  } catch (error) {
    console.warn("[TokenStore] Chave de criptografia inválida.", error);
    return null;
  }
};

const encryptionKey = getEncryptionKey();

const encrypt = (value: string) => {
  if (!encryptionKey) return value;
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
};

const decrypt = (value: string) => {
  if (!encryptionKey) return value;
  const [ivHex, tagHex, contentHex] = value.split(":");
  if (!ivHex || !tagHex || !contentHex) {
    throw new Error("Formato de token criptografado inválido.");
  }
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const content = Buffer.from(contentHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, encryptionKey, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
  return decrypted.toString("utf8");
};

const kvAvailable = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN && process.env.KV_REST_API_READ_ONLY_TOKEN
);

export class TokenStore {
  private memory = new Map<string, string>();

  async set(record: StoredTokenRecord) {
    const key = encodeKey(record.platform, record.identifier);
    const payload = JSON.stringify(record);
    const stored = encrypt(payload);

    if (kvAvailable && encryptionKey) {
      await kv.set(key, stored);
      return;
    }

    if (!encryptionKey) {
      console.warn(
        "[TokenStore] Armazenamento seguro indisponível. Persistindo tokens apenas em memória para esta sessão."
      );
    }

    this.memory.set(key, stored);
  }

  async get(platform: PlatformKey, identifier: string): Promise<StoredTokenRecord | null> {
    const key = encodeKey(platform, identifier);
    let raw: string | null = null;

    if (kvAvailable && encryptionKey) {
      raw = (await kv.get<string>(key)) ?? null;
    }

    if (!raw) {
      raw = this.memory.get(key) ?? null;
    }

    if (!raw) return null;

    try {
      const decoded = decrypt(raw);
      const parsed = JSON.parse(decoded) as StoredTokenRecord;
      return parsed;
    } catch (error) {
      console.error("[TokenStore] Falha ao descriptografar token armazenado.", error);
      return null;
    }
  }

  async delete(platform: PlatformKey, identifier: string) {
    const key = encodeKey(platform, identifier);
    if (kvAvailable && encryptionKey) {
      await kv.del(key);
    }
    this.memory.delete(key);
  }

  async list(platform?: PlatformKey): Promise<StoredTokenRecord[]> {
    const results: StoredTokenRecord[] = [];
    const prefix = platform ? `${TOKEN_NAMESPACE}:${platform}:` : `${TOKEN_NAMESPACE}:`;

    if (kvAvailable && encryptionKey) {
      console.warn("[TokenStore] Listagem de tokens via KV não está habilitada neste ambiente.");
      return results;
    }

    for (const [key, value] of this.memory.entries()) {
      if (!key.startsWith(prefix)) continue;
      try {
        const decoded = JSON.parse(decrypt(value)) as StoredTokenRecord;
        results.push(decoded);
      } catch (error) {
        console.error("[TokenStore] Não foi possível interpretar token.", error);
      }
    }

    return results;
  }
}
