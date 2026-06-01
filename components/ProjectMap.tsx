export default function ProjectMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  // OpenStreetMap embedded iframe — no API key required.
  const delta = 0.6; // bounding box size
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-forest-100 bg-forest-50">
      <iframe
        src={src}
        title={`Map for ${name}`}
        className="absolute inset-0 h-full w-full"
        loading="lazy"
      />
    </div>
  );
}
