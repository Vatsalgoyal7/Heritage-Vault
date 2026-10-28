// Heritage Vault - evaluation benchmark
// Run: node benchmark.js   (optional: npm i bcryptjs for the password-hash test)
const crypto = require("crypto");

const sizesMB = [0.1, 1, 5, 10, 25];
const RUNS = 10;

const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const ms = (t0) => Number(process.hrtime.bigint() - t0) / 1e6;

console.log(`Node ${process.version} | ${process.platform} ${process.arch} | ${require("os").cpus()[0].model}`);
console.log("\nAES-256-GCM (median of " + RUNS + " runs)");
console.log("Size(MB) | Encrypt(ms) | Decrypt(ms) | Output matches input");

for (const mb of sizesMB) {
  const data = crypto.randomBytes(Math.floor(mb * 1024 * 1024));
  const enc = [], dec = [];
  let ok = true;
  for (let i = 0; i < RUNS; i++) {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);

    let t = process.hrtime.bigint();
    const c = crypto.createCipheriv("aes-256-gcm", key, iv);
    const ct = Buffer.concat([c.update(data), c.final()]);
    const tag = c.getAuthTag();
    enc.push(ms(t));

    t = process.hrtime.bigint();
    const d = crypto.createDecipheriv("aes-256-gcm", key, iv);
    d.setAuthTag(tag);
    const pt = Buffer.concat([d.update(ct), d.final()]);
    dec.push(ms(t));

    if (!pt.equals(data)) ok = false;
  }
  console.log(`${String(mb).padEnd(8)} | ${median(enc).toFixed(2).padEnd(11)} | ${median(dec).toFixed(2).padEnd(11)} | ${ok}`);
}

// Tamper test: GCM must reject a modified ciphertext
{
  const key = crypto.randomBytes(32), iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([c.update(Buffer.from("sensitive document")), c.final()]);
  const tag = c.getAuthTag();
  ct[0] ^= 1; // flip one bit
  let rejected = false;
  try {
    const d = crypto.createDecipheriv("aes-256-gcm", key, iv);
    d.setAuthTag(tag);
    Buffer.concat([d.update(ct), d.final()]);
  } catch (e) { rejected = true; }
  console.log("\nTamper test (1 bit flipped) rejected by GCM:", rejected);
}

// bcrypt cost (rounds = 12, as used in the project)
try {
  const bcrypt = require("bcryptjs");
  const times = [];
  for (let i = 0; i < 5; i++) {
    const t = process.hrtime.bigint();
    bcrypt.hashSync("TestPassword@123", 12);
    times.push(ms(t));
  }
  console.log("bcryptjs hash, 12 rounds, median (ms):", median(times).toFixed(1));
} catch (e) {
  console.log("bcryptjs not installed, skipping (npm i bcryptjs to include it)");
}
