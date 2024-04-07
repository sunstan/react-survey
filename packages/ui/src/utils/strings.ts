export function convertVersionToInt(version: string): number {
  const parts = version.split('.').map((v) => +v);
  return parts[0] * 10000 + parts[1] * 100 + parts[2];
}
