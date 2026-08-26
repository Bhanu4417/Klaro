const map = require("@svg-maps/india");
const data = map.default || map;
// We don't have a full DOM but we can parse the d strings.
const paths = data.locations.map(l => l.path);
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

const parsePath = (pathStr) => {
  const matches = pathStr.match(/[MmLlCcSsQqTtAaZzHhVv][^MmLlCcSsQqTtAaZzHhVv]*/g) || [];
  let currentX = 0, currentY = 0;
  for (const match of matches) {
    const cmd = match[0];
    const args = match.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (cmd === 'M' || cmd === 'L') {
      currentX = args[0]; currentY = args[1];
      if(currentX < minX) minX = currentX;
      if(currentX > maxX) maxX = currentX;
      if(currentY < minY) minY = currentY;
      if(currentY > maxY) maxY = currentY;
    }
  }
}
paths.forEach(parsePath);
console.log({minX, minY, maxX, maxY});
