import test from 'ava';
import { optimize } from 'svgo';

import config from '../lib/config.mjs';

const source = `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 15.0.0, SVG Export
 Plug-In . SVG Version: 6.00 Build 0)  -->
<svg id="dd" viewBox="    0 0 187.083 67.977" xmlns="http://www.w3.org/2000/svg
   "><title>vb</title>
<metadata>645</metadata>
<defs>
<style>
  .a {
    fill: #eda921;
  }

  .a {
    stroke: #000;
    stroke-miterlimit: 10;
    stroke-width: 9.122px;
  }
</style>
</defs>
<title>SVGlogo</title>
  <g>
    <path data-d="l" class="a" d="M13.745,30.137a5.38,5.38,0,1,0,0,7.608H54.137a5.38,5.38,0,1,0,0-7.608Z"/>
  </g>
</svg>
`;

test('base', (t) => {
  const result = optimize(source, config);
  t.falsy(result.error);
  t.snapshot(result.data);
});
