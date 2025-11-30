export function toSerializable<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
