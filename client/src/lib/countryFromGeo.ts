/**
 * Emrat në GeoJSON (world.geo.json) shpesh ndryshojnë nga fusha `country` në DB.
 * Kjo hartë + përputje e drejtpërdrejtë (case-insensitive) lidh klikun me filtrimin.
 */
const GEO_NAME_TO_DB: Record<string, string> = {
  "united states of america": "USA",
  "united states": "USA",
  "u.s.a.": "USA",
  "united arab emirates": "UAE",
  "russian federation": "Russia",
  "republic of korea": "South Korea",
  "korea, republic of": "South Korea",
  "south korea": "South Korea",
  "hong kong": "China",
  "hong kong s.a.r.": "China",
  "hong kong sar": "China",
  "macao": "China",
  "macau": "China",
  "macao s.a.r.": "China",
};

export function geoNameToDbCountry(
  geoName: string | undefined,
  dbCountries: ReadonlySet<string>
): string | null {
  if (geoName == null || geoName === "") return null;
  const key = geoName.trim().toLowerCase();
  const mapped = GEO_NAME_TO_DB[key];
  if (mapped != null && dbCountries.has(mapped)) return mapped;
  for (const c of dbCountries) {
    if (c.toLowerCase() === key) return c;
  }
  return null;
}
