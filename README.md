# crc32-combine

Combine multiple crc32 values into one.

### Usage

Combining array of checksums with Node / Javascript.

```js
import crc32Combine from 'crc32-combine';
// const crc32Combine = require('crc32-combine');

const crc32 = crc32Combine([
  { crc32: 2610818631, len: 863090 },  // NOTE: First "len" property is optional.
  { crc32: 3850674250, len: 93055 },
  { crc32: 429522034, len: 3652 },
  { crc32: 2806496631, len: 68 },
  { crc32: 1131212741, len: 110 },
  { crc32: 1314652275, len: 11 },
  { crc32: 926907680, len: 19 },
  { crc32: 1186569117, len: 12 },
  { crc32: 752284923, len: 1 },
  { crc32: 852952723, len: 1 }
]);

console.log(crc32);  // 3978027761
```

With Typescript.

```ts
import crc32Combine, { type Crc32Chunk } from 'crc32-combine';

const chunks: Crc32Chunk[] = [
  { crc32: 2610818631, len: 863090 },  // NOTE: First "len" property is optional.
  { crc32: 3850674250, len: 93055 },
  { crc32: 429522034, len: 3652 },
  { crc32: 2806496631, len: 68 },
  { crc32: 1131212741, len: 110 },
  { crc32: 1314652275, len: 11 },
  { crc32: 926907680, len: 19 },
  { crc32: 1186569117, len: 12 },
  { crc32: 752284923, len: 1 },
  { crc32: 852952723, len: 1 }
];

const crc32 = crc32Combine(chunks);
console.log(crc32);  // 3978027761
```
