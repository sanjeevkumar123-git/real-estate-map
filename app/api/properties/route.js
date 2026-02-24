import properties from "@/data/properties.json";
import { haversineKm } from "@/lib/utils";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type") || "";
  const saleMode = searchParams.get("saleMode") || "";
  const usage = searchParams.get("usage") || "";
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPriceRaw = searchParams.get("maxPrice");
  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : Number.POSITIVE_INFINITY;

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radiusKm = searchParams.get("radiusKm");

  let list = [...properties];

  if (type) list = list.filter((p) => p.type === type);
  if (saleMode) list = list.filter((p) => p.saleMode === saleMode);
  if (usage) list = list.filter((p) => p.usage === usage);

  list = list.filter((p) => {
    const okMin = Number.isFinite(minPrice) ? p.price >= minPrice : true;
    const okMax = Number.isFinite(maxPrice) ? p.price <= maxPrice : true;
    return okMin && okMax;
  });

  if (q) {
    list = list.filter((p) => {
      const hay =
        `${p.title} ${p.city} ${p.locality} ${p.type} ${p.saleMode} ${p.usage}`.toLowerCase();
      return hay.includes(q);
    });
  }

  if (lat && lng && radiusKm) {
    const uLat = Number(lat);
    const uLng = Number(lng);
    const r = Number(radiusKm);

    if (Number.isFinite(uLat) && Number.isFinite(uLng) && Number.isFinite(r)) {
      list = list.filter((p) => {
        const d = haversineKm(uLat, uLng, p.lat, p.lng);
        return d <= r;
      });
    }
  }

  return Response.json({
    count: list.length,
    properties: list,
  });
}
