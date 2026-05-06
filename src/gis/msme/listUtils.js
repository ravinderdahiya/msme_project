export function chunkArray(input, size) {
  var out = [];
  if (!Array.isArray(input) || !input.length) return out;
  var n = Math.max(1, Number(size) || 1);
  for (var i = 0; i < input.length; i += n) {
    out.push(input.slice(i, i + n));
  }
  return out;
}
