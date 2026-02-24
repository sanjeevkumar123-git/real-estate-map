export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body)
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });

  const { name, mobile, email, message, propertyId, propertyTitle } = body;

  if (!name || !mobile || !email) {
    return Response.json(
      { ok: false, error: "Name, Mobile and Email are required" },
      { status: 400 },
    );
  }

  const enquiry = {
    name,
    mobile,
    email,
    message: message || "",
    propertyId: propertyId || null,
    propertyTitle: propertyTitle || null,
    createdAt: new Date(),
  };

  console.log("📩 Enquiry (mocked):", enquiry);
  return Response.json({ ok: true, stored: "console" });
}
