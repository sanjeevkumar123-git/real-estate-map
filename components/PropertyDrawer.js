"use client";

import { formatINR } from "@/lib/utils";

export default function PropertyDrawer({ property, onClose, onEnquire }) {
  if (!property) return null;

  return (
    <div className="drawerBackdrop" onMouseDown={onClose}>
      <div className="drawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="drawerHeader">
          <h2 className="drawerTitle">{property.title}</h2>
          <button className="drawerClose" onClick={onClose}>
            Close
          </button>
        </div>

        <div
          style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          <span className="badge">{property.type}</span>
          <span className="badge">{property.saleMode}</span>
          <span className="badge">{property.usage}</span>
        </div>

        <hr className="sep" />

        <div className="imgGrid">
          {(property.images || []).slice(0, 4).map((src, idx) => (
            <img key={idx} src={src} alt={`${property.title} ${idx + 1}`} />
          ))}
        </div>

        <hr className="sep" />

        <div style={{ fontSize: 18, fontWeight: 800 }}>
          {formatINR(property.price)}
          <span className="small" style={{ fontWeight: 500 }}>
            {" "}
            • {property.area} sq ft
          </span>
        </div>

        <div className="small" style={{ marginTop: 6 }}>
          <b>Location:</b> {property.locality}, {property.city}
        </div>
        <div className="small" style={{ marginTop: 6 }}>
          <b>Coordinates:</b> {property.lat}, {property.lng}
        </div>

        <hr className="sep" />

        <div className="small" style={{ lineHeight: 1.5 }}>
          {property.description}
        </div>

        <div
          style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          <button
            className="btn btnPrimary"
            onClick={() => onEnquire(property)}
          >
            Send Enquiry
          </button>
        </div>
      </div>
    </div>
  );
}
