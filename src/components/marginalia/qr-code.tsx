import { qrMatrix } from "@/lib/marginalia-paths";

export function ScannableQRCode({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  const grid = qrMatrix(text);
  if (!grid) return null;

  const size = grid.length;
  let d = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (grid[y][x]) d += `M${x} ${y}h1v1h-1z`;
    }
  }

  return (
    <svg
      viewBox={`-2 -2 ${size + 4} ${size + 4}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label}
      className="block h-auto w-full"
    >
      <path d={d} fill="#1B2326" />
    </svg>
  );
}
