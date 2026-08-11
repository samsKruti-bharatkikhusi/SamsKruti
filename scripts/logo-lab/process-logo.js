// Process the downloaded artwork into app assets.
//  main logo  : ChatGPT Image Jun 11 ... 01_03_51 (cream bg) -> medallion
//  favicon/S  : ChatGPT Image Jun 11 ... 01_02_38 (black bg) -> S coin
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const ROOT = path.resolve(__dirname, "..", "..");
const DL = "C:/Users/DELL/Downloads";
const MAIN = `${DL}/ChatGPT Image Jun 11, 2026, 01_03_51 AM.png`;
const FAV = `${DL}/ChatGPT Image Jun 11, 2026, 01_02_38 AM.png`;
const IVORY = "#FAF7F3", PARCH = "#F5E8DC";

// cut a transparent circle (cx,cy,r) out of `src`, return tight PNG buffer
async function circle(src, cx, cy, r) {
  const meta = await sharp(src).metadata();
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/></svg>`);
  const comp = await sharp(src).ensureAlpha().composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  return sharp(comp).extract({ left: cx - r, top: cy - r, width: 2 * r, height: 2 * r }).png().toBuffer();
}

async function main() {
  const medallion = await circle(MAIN, 627, 627, 590); // main logo
  const sCoin = await circle(FAV, 627, 627, 528);       // S favicon coin

  fs.writeFileSync(path.join(ROOT, "public/brand/samskruti-medallion.png"), medallion);
  fs.writeFileSync(path.join(ROOT, "public/brand/samskruti-s.png"), sCoin);

  // themed S coins — one per section accent (the S is the universal nav logo,
  // tinted to each page's theme). Hub = earth/terracotta.
  const THEMES = { hub: "#C8652A", galiyan: "#3D7050", parampara: "#A83828", hriday: "#4F76B0" };
  for (const [k, c] of Object.entries(THEMES)) {
    await sharp(sCoin).tint(c).resize(256, 256).png().toFile(path.join(ROOT, `public/brand/s-${k}.png`));
  }

  // favicon + app icon: the original (untinted) S coin
  await sharp(sCoin).resize(256, 256).png().toFile(path.join(ROOT, "src/app/icon.png"));
  await sharp(sCoin).resize(180, 180).flatten({ background: IVORY }).png().toFile(path.join(ROOT, "src/app/apple-icon.png"));

  // OG card: medallion centred on parchment
  const med520 = await sharp(medallion).resize(520, 520).png().toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: PARCH } })
    .composite([{ input: med520, left: (1200 - 520) / 2, top: (630 - 520) / 2 }]).png()
    .toFile(path.join(ROOT, "public/brand/og.png"));

  // previews
  await sharp(medallion).resize(300, 300).flatten({ background: IVORY }).png().toFile(path.join(__dirname, "pv_med.png"));
  await sharp(medallion).resize(44, 44).flatten({ background: "#1F0F06" }).png().toFile(path.join(__dirname, "pv_nav44.png"));
  await sharp(sCoin).resize(64, 64).png().toFile(path.join(__dirname, "pv_s64.png"));
  await sharp(sCoin).resize(32, 32).png().toFile(path.join(__dirname, "pv_s32.png"));
  await sharp(sCoin).resize(16, 16).png().toFile(path.join(__dirname, "pv_s16.png"));
  console.log("done");
}
main();
