const fs = require('fs');
const mapData = require("@svg-maps/india");
const map = mapData.default || mapData;

let svgPaths = map.locations.map(l => `<path d="${l.path}" fill="#ccc" stroke="#333" />`).join('\n');

const dataFile = fs.readFileSync('src/components/community/indiaMapData.ts', 'utf8');
const pointsMatch = [...dataFile.matchAll(/city:\s*"([^"]+)",\s*state:\s*"[^"]+",\s*x:\s*([\d.]+),\s*y:\s*([\d.]+)/g)];

let pinsHtml = pointsMatch.map(m => {
  return `<div style="position:absolute; left:${m[2]}%; top:${m[3]}%; width:6px; height:6px; background:red; border-radius:50%; transform:translate(-50%, -50%);" title="${m[1]}"></div>`;
}).join('\n');

const html = `
<!DOCTYPE html>
<html>
<body>
  <div style="position: relative; width: 612px; height: 696px; border: 1px solid red;">
    <svg viewBox="0 0 612 696" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;">
      ${svgPaths}
    </svg>
    <div id="pins" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
      ${pinsHtml}
    </div>
  </div>
</body>
</html>
`;
fs.writeFileSync('map-visual.html', html);
