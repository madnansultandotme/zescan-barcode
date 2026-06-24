import { Preferences } from "@capacitor/preferences";

export interface Scan {
  id: string;
  rawValue: string;
  format: string;
  timestamp: number;
}

export async function saveScan(scan: Scan) {
  const existing = await Preferences.get({ key: "history" });

  const history = existing.value ? JSON.parse(existing.value) : [];

  history.unshift(scan);

  await Preferences.set({
    key: "history",
    value: JSON.stringify(history),
  });
}

export async function getHistory(): Promise<Scan[]> {
  const existing = await Preferences.get({ key: "history" });
  return existing.value ? JSON.parse(existing.value) : [];
}

export async function clearHistory() {
  await Preferences.remove({ key: "history" });
}
