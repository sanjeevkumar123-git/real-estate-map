"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { formatINR } from "@/lib/utils";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const TYPE_COLORS = {
  Land: "#22c55e",
  Plot: "#84cc16",
  Flat: "#38bdf8",
  Villa: "#a78bfa",
  Office: "#f59e0b",
  Shop: "#fb7185",
  Warehouse: "#f97316",
};

function coloredMarker(color) {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="46" viewBox="0 0 34 46">
      <path d="M17 45c9-14 13-20 13-28A13 13 0 0 0 4 17c0 8 4 14 13 28z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="17" cy="17" r="6" fill="white"/>
    </svg>
  `);

  return L.icon({
    iconUrl: `data:image/svg+xml,${svg}`,
    iconSize: [34, 46],
    iconAnchor: [17, 45],
    popupAnchor: [0, -36],
  });
}

function FitBounds({ properties }) {
  const map = useMap();

  useEffect(() => {
    if (!properties || properties.length === 0) return;

    const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng]));

    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
  }, [properties, map]);

  return null;
}

function MarkersLayer({ properties, onOpenDetails }) {
  const map = useMap();

  return (
    <>
      {(properties || []).map((p) => {
        const color = TYPE_COLORS[p.type] || "#60a5fa";
        const icon = coloredMarker(color);

        return (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={icon}>
            <Popup>
              <div style={{ minWidth: 220 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  {p.title}
                </div>

                <div className="small" style={{ marginBottom: 8 }}>
                  <span className="price">{formatINR(p.price)}</span>
                  {" • "}
                  {p.area} sq ft
                  <br />
                  {p.locality}, {p.city}
                </div>

                <button
                  className="viewDetailsBtn"
                  onClick={() => {
                    map.closePopup();
                    onOpenDetails(p);
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default function MapView({ properties, onOpenDetails, userLocation }) {
  const center = useMemo(() => {
    if (userLocation?.lat && userLocation?.lng) {
      return [userLocation.lat, userLocation.lng];
    }

    if (properties?.length) {
      return [properties[0].lat, properties[0].lng];
    }

    return [20.5937, 78.9629];
  }, [properties, userLocation]);

  return (
    <div className="mapWrap">
      <MapContainer center={center} zoom={5} scrollWheelZoom>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds properties={properties} />

        <MarkersLayer properties={properties} onOpenDetails={onOpenDetails} />
      </MapContainer>
    </div>
  );
}
