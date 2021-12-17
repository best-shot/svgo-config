# svgo-config <img src="https://cdn.jsdelivr.net/gh/svg/svgo/logo/isotype.svg" alt="logo" height="80" align="right">

A [svgo] config to keep svg files clean.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[svgo]: https://github.com/svg/svgo
[npm-url]: https://www.npmjs.com/package/svgo-config
[npm-badge]: https://img.shields.io/npm/v/svgo-config.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/svgo-config
[github-badge]: https://img.shields.io/npm/l/svgo-config.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/svgo-config.svg?style=flat-square&colorB=green&logo=node.js

## Installation

```bash
npm install svgo-config --save-dev
```

## Usage

```bash
svgo *.svg --config node_modules/svgo-config/lib/config.json
```

```cjs
const config = require('svgo-config/lib/config.cjs');
```

```mjs
import config from 'svgo-config/lib/config.mjs';
```
