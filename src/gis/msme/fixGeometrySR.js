export function fixGeometrySR(g) {
  if (!g) return null;

  var x = g.x || (g.extent && g.extent.xmin);
  var y = g.y || (g.extent && g.extent.ymin);

  if (x == null || y == null) return null;

  if (Math.abs(x) > 1000000 && Math.abs(y) > 1000000) {
    g.spatialReference = { wkid: 3857 };
  } else if (x > 100000 && x < 900000 && y > 2000000 && y < 4000000) {
    g.spatialReference = { wkid: 32643 };
  } else {
    console.warn("Unknown SR, skipping geometry", x, y);
    return null;
  }

  return g;
}
