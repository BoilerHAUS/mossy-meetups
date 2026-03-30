const MAX_LOCATION_OPTIONS = 4;

export function parseLocationOptionNames(value?: string) {
  const names = (value ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  const deduped = names.filter((name, index) => names.indexOf(name) === index);

  return deduped.slice(0, MAX_LOCATION_OPTIONS);
}

export function hasTooManyLocationOptions(value?: string) {
  const names = (value ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  return new Set(names).size > MAX_LOCATION_OPTIONS;
}
