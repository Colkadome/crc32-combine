/*!
 * crc32-combine - Combine multiple crc32 values into one.
 * @license MIT
 * @copyright Colkadome
 * @see {@link https://github.com/Colkadome/crc32-combine/blob/main/LICENSE}
 */

// Types.
export interface Crc32Chunk {
  crc32: number;
  len: number;
}

/**
 * @param {number[]} mat
 * @param {number} vec
 * @returns {number}
 */
function gf2MatrixTimes(mat: Uint32Array, vec: number): number {
  let mat_idx = 0;
  let sum = 0;
  while (vec > 0 && mat_idx < mat.length) {
    if (vec & 1) {
      sum ^= mat[mat_idx];
    }
    vec = Math.floor(vec / 2);
    mat_idx++;
  }
  return sum >>> 0;
}

/**
 * @param {number[]} square
 * @param {number[]} mat
 */
function gf2MatrixSquare(square: Uint32Array, mat: Uint32Array) {
  for (let n = 0; n < square.length; n++) {
    square[n] = gf2MatrixTimes(mat, mat[n]);
  }
}

/**
 * Combines an existing checksum with an incoming checksum + length.
 * 
 * @param {number} crc1 - Existing checksum.
 * @param {number} crc2 - Incoming checksum.
 * @param {number} len2 - Incoming length.
 * 
 * @returns {number} The combined crc32 checksum.
 */
function crc32Combine(crc1: number, crc2: number, len2: number): number {

  if (len2 <= 0) {
    return crc1;
  }

  const even = new Uint32Array([
    1994146192, 3988292384, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512,
    1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144,
    524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432,
    67108864, 134217728, 268435456, 536870912
  ]);

  const odd = new Uint32Array([
    498536548, 997073096, 1994146192, 3988292384, 1, 2, 4, 8, 16, 32, 64,
    128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536,
    131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608,
    16777216, 33554432, 67108864, 134217728
  ]);

  let isEven = true;
  while (len2 > 0) {
    gf2MatrixSquare(isEven ? even : odd, isEven ? odd : even);
    if (len2 & 1) {
      crc1 = gf2MatrixTimes(isEven ? even : odd, crc1);
    }
    len2 = Math.floor(len2 / 2);
    isEven = !isEven;
  }

  return (crc1 ^ crc2) >>> 0;

}

/**
 * Helper function to check the provided "chunks" argument.
 * 
 * @param {Crc32Chunk[]} chunks
 */
function checkChunks(chunks: Crc32Chunk[]) {
  if (!Array.isArray(chunks)) {
    throw new Error('Chunks must be an array');
  }
  if (chunks.length === 0) {
    throw new Error('Chunks array must not be empty');  
  }
  for (let i = 0; i < chunks.length; i++) {
    if (!chunks[i]) {
      throw new Error(`Chunk ${i}: must be an object`);
    }
    if (typeof chunks[i].crc32 !== 'number') {
      throw new Error(`Chunk ${i}: invalid crc32 property`);
    }
    if (typeof chunks[i].len !== 'number') {
      throw new Error(`Chunk ${i}: invalid length property`);
    }
  }
}

/**
 * Function to combine several crc32 checksums into one.
 * 
 * @param {Crc32Chunk[]} chunks
 * 
 * @returns {number} The combined crc32 checksum.
 */
function combineCrc32Checksums(chunks: Crc32Chunk[]): number {

  // Check args.
  checkChunks(chunks);

  // Get checksums, starting from first chunk.
  let result = chunks[0].crc32;
  for (let i = 1; i < chunks.length; i++) {
    result = crc32Combine(result, chunks[i].crc32, chunks[i].len);
  }
  return result;

}

// Exports.
export default combineCrc32Checksums;
