"use client";

import { formatINR } from "@/lib/utils";

export default function ListView({ properties, onOpenDetails }) {
  return (
    <div className="card">
      <div className="small" style={{ marginBottom: 10 }}>
        Click a row to open details.
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>City</th>
            <th>Price</th>
            <th>Area</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr
              key={p.id}
              style={{ cursor: "pointer" }}
              onClick={() => onOpenDetails(p)}
            >
              <td>
                <div style={{ fontWeight: 700 }}>{p.title}</div>
                <div className="small">{p.locality}</div>
              </td>
              <td>{p.type}</td>
              <td>{p.city}</td>
              <td style={{ fontWeight: 800 }}>{formatINR(p.price)}</td>
              <td>{p.area} sq ft</td>
            </tr>
          ))}
          {!properties.length ? (
            <tr>
              <td colSpan={5} className="small">
                No results.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
