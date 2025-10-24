declare module "xlsx" {
  const XLSX: any;
  export = XLSX;
}

declare module "@vercel/kv" {
  export const kv: {
    get<T = unknown>(key: string): Promise<T | null>;
    set(key: string, value: any): Promise<void>;
    del(key: string): Promise<void>;
  };
}
