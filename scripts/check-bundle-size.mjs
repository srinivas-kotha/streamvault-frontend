#!/usr/bin/env node
/**
 * SRI-205: Bundle size regression guard
 * Fails if total gzipped JS exceeds 500 KB or initial load exceeds 300 KB.
 * Run after `npm run build`.
 */
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { gzipSync } from "zlib";

const assetsDir = join(process.cwd(), "dist", "assets");
const files = readdirSync(assetsDir).filter((f) => f.endsWith(".js"));

let totalGzip = 0;
let initialGzip = 0; // excludes hls, mpegts (lazily loaded media chunks)

for (const file of files) {
  const content = readFileSync(join(assetsDir, file));
  const gzipped = gzipSync(content).length;
  totalGzip += gzipped;
  if (!file.startsWith("vendor-hls") && !file.startsWith("vendor-mpegts")) {
    initialGzip += gzipped;
  }
}

const totalKB = (totalGzip / 1024).toFixed(1);
const initialKB = (initialGzip / 1024).toFixed(1);

console.log(`Bundle size report:`);
console.log(`  Total (all chunks, gzip):   ${totalKB} KB`);
console.log(`  Initial load (gzip):        ${initialKB} KB  (excludes hls/mpegts)`);

const TOTAL_LIMIT_KB = 500;
const INITIAL_LIMIT_KB = 300;

let failed = false;
if (totalGzip / 1024 > TOTAL_LIMIT_KB) {
  console.error(`FAIL: Total gzip ${totalKB} KB exceeds limit of ${TOTAL_LIMIT_KB} KB`);
  failed = true;
}
if (initialGzip / 1024 > INITIAL_LIMIT_KB) {
  console.error(`FAIL: Initial load gzip ${initialKB} KB exceeds limit of ${INITIAL_LIMIT_KB} KB`);
  failed = true;
}
if (!failed) {
  console.log(`PASS: Bundle sizes within limits.`);
}
process.exit(failed ? 1 : 0);
