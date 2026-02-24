"use client";

import { useMemo } from "react";

const PROPERTY_TYPES = [
  "Land",
  "Plot",
  "Flat",
  "Villa",
  "Office",
  "Shop",
  "Warehouse",
];
const SALE_MODES = ["Fresh", "Resale"];
const USAGE = ["Residential", "Commercial"];

export default function FiltersBar({
  filters,
  setFilters,
  onNearMe,
  onClearNearMe,
  onClearAll,
  viewMode,
  setViewMode,
  totalCount,
}) {
  const chips = useMemo(() => {
    const out = [];
    if (filters.type) out.push({ key: "type", label: `Type: ${filters.type}` });
    if (filters.saleMode)
      out.push({ key: "saleMode", label: `Sale: ${filters.saleMode}` });
    if (filters.usage)
      out.push({ key: "usage", label: `Usage: ${filters.usage}` });
    if (filters.minPrice)
      out.push({ key: "minPrice", label: `Min: ₹${filters.minPrice}` });
    if (filters.maxPrice)
      out.push({ key: "maxPrice", label: `Max: ₹${filters.maxPrice}` });
    if (filters.q) out.push({ key: "q", label: `Search: ${filters.q}` });
    if (filters.nearMe?.enabled) {
      out.push({
        key: "nearMe",
        label: `Near me: ${filters.nearMe.radiusKm} km`,
      });
    }
    return out;
  }, [filters]);

  function removeChip(key) {
    if (key === "nearMe") {
      onClearNearMe();
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: "" }));
  }

  return (
    <div className="card">
      <div className="header">
        <div>
          <div className="small">Results</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{totalCount}</div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className={`btn ${viewMode === "map" ? "btnPrimary" : ""}`}
            onClick={() => setViewMode("map")}
          >
            Map View
          </button>
          <button
            className={`btn ${viewMode === "list" ? "btnPrimary" : ""}`}
            onClick={() => setViewMode("list")}
          >
            List View
          </button>

          <button className="btn" onClick={onNearMe}>
            Search near me
          </button>
          {filters.nearMe?.enabled ? (
            <button className="btn btnDanger" onClick={onClearNearMe}>
              Clear near me
            </button>
          ) : null}

          <button className="btn btnDanger" onClick={onClearAll}>
            Clear all
          </button>
        </div>
      </div>

      <div className="gridFilters">
        <div>
          <div className="small">Property Type</div>
          <select
            className="select"
            value={filters.type}
            onChange={(e) =>
              setFilters((p) => ({ ...p, type: e.target.value }))
            }
          >
            <option value="">All</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="small">Sale Mode</div>
          <select
            className="select"
            value={filters.saleMode}
            onChange={(e) =>
              setFilters((p) => ({ ...p, saleMode: e.target.value }))
            }
          >
            <option value="">All</option>
            {SALE_MODES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="small">Usage</div>
          <select
            className="select"
            value={filters.usage}
            onChange={(e) =>
              setFilters((p) => ({ ...p, usage: e.target.value }))
            }
          >
            <option value="">All</option>
            {USAGE.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="small">Budget Min (₹)</div>
          <input
            className="input"
            inputMode="numeric"
            placeholder="e.g. 5000000"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                minPrice: e.target.value.replace(/[^\d]/g, ""),
              }))
            }
          />
        </div>

        <div>
          <div className="small">Budget Max (₹)</div>
          <input
            className="input"
            inputMode="numeric"
            placeholder="e.g. 30000000"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                maxPrice: e.target.value.replace(/[^\d]/g, ""),
              }))
            }
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <div className="small">Location Search</div>
          <input
            className="input"
            placeholder="Search by title / city / locality (e.g. Mumbai, Andheri, HSR)"
            value={filters.q}
            onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
          />
        </div>
      </div>

      {chips.length ? (
        <div className="kpis">
          {chips.map((c) => (
            <span key={c.key} className="chip">
              {c.label}
              <button
                aria-label="remove filter"
                onClick={() => removeChip(c.key)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="small" style={{ marginTop: 10 }}>
          Tip: Use filters to narrow results. Click markers to open details.
        </div>
      )}
    </div>
  );
}
