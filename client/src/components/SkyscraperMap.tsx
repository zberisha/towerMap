import L from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { geoNameToDbCountry } from "../lib/countryFromGeo";
import type { ThemeMode } from "../lib/themeStorage";
import type { Skyscraper } from "../types/skyscraper";
import styles from "./skyscraper-map.module.css";

const COUNTRIES_GEO_URL =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

function FitBounds({
  towers,
  selectedCountry,
  allTowers,
}: {
  towers: Skyscraper[];
  selectedCountry: string | null;
  allTowers: Skyscraper[];
}) {
  const map = useMap();
  useEffect(() => {
    const target =
      towers.length > 0 ? towers : !selectedCountry && allTowers.length > 0 ? allTowers : [];
    if (target.length > 0) {
      const b = L.latLngBounds(target.map((i) => [i.lat, i.lng] as [number, number]));
      map.fitBounds(b, { padding: [56, 56], maxZoom: selectedCountry != null ? 6 : 4 });
    } else {
      map.setView([20, 0], 2);
    }
  }, [map, towers, selectedCountry, allTowers]);
  return null;
}

function markerColor(heightM: number, maxH: number, theme: ThemeMode): string {
  const t = maxH > 0 ? heightM / maxH : 0.5;
  const hue = 210 + (1 - t) * 55;
  if (theme === "light") {
    const light = 32 + t * 14;
    return `hsl(${hue.toFixed(0)}, 85%, ${light.toFixed(0)}%)`;
  }
  const light = 42 + t * 18;
  return `hsl(${hue.toFixed(0)}, 78%, ${light.toFixed(0)}%)`;
}

function featureName(feature: Feature): string {
  const p = feature.properties as { name?: string } | null | undefined;
  return p?.name ?? "";
}

interface SkyscraperMapProps {
  allTowers: Skyscraper[];
  visibleTowers: Skyscraper[];
  maxHeightM: number;
  theme: ThemeMode;
  selectedCountry: string | null;
  dbCountries: ReadonlySet<string>;
  onCountrySelect: (dbCountry: string) => void;
  onSelectTower: (tower: Skyscraper) => void;
}

export function SkyscraperMap({
  allTowers,
  visibleTowers,
  maxHeightM,
  theme,
  selectedCountry,
  dbCountries,
  onCountrySelect,
  onSelectTower,
}: SkyscraperMapProps) {
  const { t, i18n } = useTranslation();
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [geoError, setGeoError] = useState(false);

  const onCountrySelectRef = useRef(onCountrySelect);
  const dbCountriesRef = useRef(dbCountries);
  onCountrySelectRef.current = onCountrySelect;
  dbCountriesRef.current = dbCountries;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(COUNTRIES_GEO_URL);
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as FeatureCollection;
        if (!cancelled) setGeoData(json);
      } catch {
        if (!cancelled) {
          setGeoError(true);
          setGeoData(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tileUrl =
    theme === "light"
      ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const markerStroke = theme === "light" ? "#1e3a5f" : "#0f172a";

  const countryStyle = useCallback(
    (feature?: Feature) => {
      if (feature == null) return {} as L.PathOptions;
      const db = geoNameToDbCountry(featureName(feature), dbCountries);
      const selected = selectedCountry != null && db === selectedCountry;
      const hasData = db != null && dbCountries.has(db);

      if (theme === "light") {
        return {
          fillColor: selected ? "#2563eb" : hasData ? "#94a3b8" : "#cbd5e1",
          fillOpacity: selected ? 0.38 : hasData ? 0.22 : 0.12,
          color: selected ? "#1d4ed8" : "#64748b",
          weight: selected ? 1.4 : 0.6,
        } satisfies L.PathOptions;
      }
      return {
        fillColor: selected ? "#3b82f6" : hasData ? "#475569" : "#334155",
        fillOpacity: selected ? 0.4 : hasData ? 0.18 : 0.08,
        color: selected ? "#60a5fa" : "#475569",
        weight: selected ? 1.2 : 0.55,
      } satisfies L.PathOptions;
    },
    [theme, selectedCountry, dbCountries]
  );

  const onEachCountry = useCallback((feature: Feature, layer: L.Layer) => {
    layer.on({
      click: (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        const db = geoNameToDbCountry(featureName(feature), dbCountriesRef.current);
        if (db != null) onCountrySelectRef.current(db);
      },
    });
  }, []);

  const legendHint =
    selectedCountry != null
      ? t("map.legendFiltered", { country: selectedCountry })
      : t("map.legendHint");

  return (
    <div className={styles.wrap}>
      <MapContainer
        className={styles.map}
        center={[20, 40]}
        zoom={2}
        scrollWheelZoom
        worldCopyJump
      >
        <TileLayer
          key={theme}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />
        {geoData != null && (
          <GeoJSON data={geoData} style={countryStyle} onEachFeature={onEachCountry} />
        )}
        <FitBounds
          towers={visibleTowers}
          selectedCountry={selectedCountry}
          allTowers={allTowers}
        />
        {visibleTowers.map((s) => {
          const r = 4 + (s.heightM / (maxHeightM || 1)) * 11;
          const fill = markerColor(s.heightM, maxHeightM, theme);
          return (
            <CircleMarker
              key={s._id}
              center={[s.lat, s.lng]}
              radius={Math.min(18, Math.max(5, r))}
              pathOptions={{
                color: markerStroke,
                weight: 1,
                fillColor: fill,
                fillOpacity: 0.9,
              }}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  onSelectTower(s);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={0.95} permanent={false}>
                <span className={styles.ttName}>{s.name}</span>
                <br />
                <span className={styles.ttMeta}>{s.heightM} m</span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className={styles.legend} dir={i18n.dir(i18n.language)}>
        <strong>{t("map.legendTitle")}</strong>
        <div>{legendHint}</div>
        {geoError && <div className={styles.legendWarn}>{t("map.geoError")}</div>}
      </div>
    </div>
  );
}
