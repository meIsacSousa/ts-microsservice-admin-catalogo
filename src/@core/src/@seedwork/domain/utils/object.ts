export function deepFreeze<T>(obj: T) {
  for (const prop in obj) {
    const value = obj[prop];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}
