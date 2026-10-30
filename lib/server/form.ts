import "server-only";

export const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
export const optional = (data: FormData, key: string) => text(data, key) || null;
export const list = (data: FormData, key: string) => data.getAll(key).map(String);
export const int = (data: FormData, key: string) => {
  const v = text(data, key);
  return v === "" ? null : Math.max(0, Math.round(Number(v))) || 0;
};
