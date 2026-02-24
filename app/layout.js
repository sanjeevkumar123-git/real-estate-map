import "./globals.css";

export const metadata = {
  title: "Property Discovery",
  description: "Minimal real estate discovery with map + filters",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {children}
      </body>
    </html>
  );
}
