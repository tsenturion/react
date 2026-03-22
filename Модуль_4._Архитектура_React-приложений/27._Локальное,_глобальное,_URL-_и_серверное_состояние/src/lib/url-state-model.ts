export function readQueryValue<T extends string>(
  search: string,
  key: string,
  fallback: T,
  allowedValues?: readonly T[],
) {
  const params = new URLSearchParams(search);
  const value = params.get(key);

  if (!value) {
    return fallback;
  }

  if (allowedValues && !allowedValues.includes(value as T)) {
    return fallback;
  }

  return value as T;
}

export function writeQueryValue(
  search: string,
  key: string,
  value: string,
  fallback?: string,
) {
  const params = new URLSearchParams(search);

  if (value.length === 0 || (fallback !== undefined && value === fallback)) {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  const nextSearch = params.toString();
  return nextSearch.length > 0 ? `?${nextSearch}` : '';
}
