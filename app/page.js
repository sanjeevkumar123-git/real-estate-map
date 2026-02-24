"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import FiltersBar from "@/components/FilterBars";
import PropertyDrawer from "@/components/PropertyDrawer";
import EnquiryModal from "@/components/EnquiryModal";
import ListView from "@/components/ListView";
import { buildQuery } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const DEFAULT_FILTERS = {
  type: "",
  saleMode: "",
  usage: "",
  minPrice: "",
  maxPrice: "",
  q: "",
  nearMe: { enabled: false, lat: null, lng: null, radiusKm: 5 },
};

export default function Page() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [data, setData] = useState({ count: 0, properties: [] });
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const [viewMode, setViewMode] = useState("map");

  const debouncedQ = useDebouncedValue(filters.q, 350);

  const queryParams = useMemo(() => {
    const params = {
      type: filters.type,
      saleMode: filters.saleMode,
      usage: filters.usage,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      q: debouncedQ,
    };

    if (filters.nearMe?.enabled && filters.nearMe.lat && filters.nearMe.lng) {
      params.lat = filters.nearMe.lat;
      params.lng = filters.nearMe.lng;
      params.radiusKm = filters.nearMe.radiusKm || 5;
    }

    return params;
  }, [filters, debouncedQ]);

  async function fetchProperties() {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties${buildQuery(queryParams)}`, {
        cache: "no-store",
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
      setData({ count: 0, properties: [] });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    queryParams.type,
    queryParams.saleMode,
    queryParams.usage,
    queryParams.minPrice,
    queryParams.maxPrice,
    queryParams.q,
    queryParams.lat,
    queryParams.lng,
    queryParams.radiusKm,
  ]);

  function openDetails(p) {
    setSelected(p);
  }

  function closeDetails() {
    setSelected(null);
  }

  function openEnquiry(p) {
    setSelected(p);
    setEnquiryOpen(true);
  }

  function onClearAll() {
    setSelected(null);
    setFilters(DEFAULT_FILTERS);
  }

  async function onNearMe() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setFilters((p) => ({
          ...p,
          nearMe: {
            enabled: true,
            lat,
            lng,
            radiusKm: p.nearMe?.radiusKm || 5,
          },
        }));
      },
      (err) => {
        console.error(err);
        alert(
          "Unable to fetch your location. Allow location access and retry.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function onClearNearMe() {
    setFilters((p) => ({
      ...p,
      nearMe: { enabled: false, lat: null, lng: null, radiusKm: 5 },
    }));
  }

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <h1>Property Discovery</h1>
          <p>Map + Filters + Enquiry </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="small">{loading ? "Loading..." : "Ready"}</span>
          <button className="btn" onClick={() => fetchProperties()}>
            Refresh
          </button>
        </div>
      </div>

      <FiltersBar
        filters={filters}
        setFilters={setFilters}
        onNearMe={onNearMe}
        onClearNearMe={onClearNearMe}
        onClearAll={onClearAll}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalCount={data.count}
      />

      <div style={{ height: 12 }} />

      {viewMode === "map" ? (
        <MapView
          properties={data.properties}
          onOpenDetails={openDetails}
          userLocation={
            filters.nearMe?.enabled
              ? { lat: filters.nearMe.lat, lng: filters.nearMe.lng }
              : null
          }
        />
      ) : (
        <ListView properties={data.properties} onOpenDetails={openDetails} />
      )}

      <PropertyDrawer
        property={selected}
        onClose={closeDetails}
        onEnquire={openEnquiry}
      />

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        property={selected}
      />
    </div>
  );
}
