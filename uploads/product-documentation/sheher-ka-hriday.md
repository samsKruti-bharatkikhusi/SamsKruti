# Sheher Ka Hriday — Product Documentation (Varanasi)

The artisan / heritage-box segment. Focused on **FIVE products**, gone deep.
Goal: the user should feel they have **entered the art of Varanasi** — and
build their own box, piece by piece, each with its story. The box is not an
image; it should feel real (3D / assembling).

See [00-platform-concept.md](00-platform-concept.md). Stories below are written
to be felt; maker names are ILLUSTRATIVE until verified.

## The five (finalized)
1. Banarasi Silk Saree — Textile — Madanpura/Lallapura — GI
2. Tamba (Copper & Brass) — Metal — Thatheri Bazar — repoussé GI
3. Banaras Handmade Paper — Paper — Kashmiriganj
4. Wooden Toys & Lacquerware — Wood — Khojwan — GI
5. Clay — Kulhad & Pottery — Clay — Bhadaini / riverbank

---

### 1 · Banarasi Silk Saree  ·  बनारसी साड़ी
- Where: Madanpura / Lallapura · ~[83.004, 25.306] · GI
- THE WHY: For five centuries Banaras has woven silk threaded with real gold and
  silver zari. A single saree takes weeks to months on a pit loom; its motifs —
  bel, buti, jhallar — carry Mughal-Persian and ancient Indian memory, learned by
  watching, never written down. To wear one is to wear the city's most patient art.
- THE MAKER: Raheem Ansari · weaver, Madanpura — at a loom his grandfather built.
- THE ADDITION: "Five centuries, six months, one saree."
- IMAGES: [ ] saree (clean, folded/draped) · [ ] the loom / hands weaving · [ ] the weaver

### 2 · Tamba — Copper & Brass  ·  तांबा-पीतल
- Where: Thatheri Bazar (the street of metal-beaters) · ~[83.012, 25.312] · repoussé GI
- THE WHY: In Thatheri Bazar the day begins with hammers. Copper (tamba) and brass
  are beaten into the lotas, thalis and diyas Kashi prays with, and embossed
  (repoussé) with deities and stories. The same tools have shaped the same forms
  for centuries — the metal holds the sound of the city's devotion.
- THE MAKER: Vishwanath Kasera · metalsmith, Thatheri Bazar.
- THE ADDITION: "Beaten by hand, in the street of hammers."
- IMAGES: [ ] a diya / lota / repoussé plate · [ ] hammering at the anvil · [ ] the smith / lane

### 3 · Banaras Handmade Paper  ·  हस्तनिर्मित कागज़
- Where: Kashmiriganj · ~[82.998, 25.299]
- THE WHY: Long before mills, Kashi made paper by hand from cotton rags — pulped,
  pulled on a screen, sun-dried into thick deckle-edged sheets that hold ink like
  cloth holds dye. Folded today into journals, cards and lamps. To write on it is
  to write on something made, not manufactured.
- THE MAKER: Imran Ali · paper-maker, Kashmiriganj.
- THE ADDITION: "Pulled from rag and river, sheet by sheet."
- IMAGES: [ ] a journal / stack of sheets · [ ] pulling pulp on the screen / drying · [ ] the workshop

### 4 · Wooden Toys & Lacquerware  ·  लकड़ी के खिलौने
- Where: Khojwan · ~[82.994, 25.295] · GI
- THE WHY: When ivory was banned, Kashi's carvers turned to soft gular wood —
  shaping birds, gods and spinning tops, then sealing them in lac dyed sindoor-red,
  turmeric-yellow and leaf-green, melted onto the grain while the piece spins on a
  hand-lathe. Toys that have delighted children for over a century, made by some
  200 families.
- THE MAKER: Ram Khelawan · khilauna-maker, Khojwan.
- THE ADDITION: "Colour spun onto wood, the way it has for a century."
- IMAGES: [ ] a set of lacquered toys/figurines · [ ] lac applied on the lathe · [ ] the maker

### 5 · Clay — Kulhad & Pottery  ·  मिट्टी के कुल्हड़
- Where: Bhadaini / riverbank potter quarters · ~[83.000, 25.288]
- THE WHY: From the clay of the Ganga's banks, Kashi's kumhars throw kulhads — the
  unglazed cups that give ghat chai its earth-smell — and the diyas that float at
  dusk. Shaped in seconds on a spinning wheel, fired in a kiln older than memory,
  used once and returned to the earth. The humblest, most sacred object in the city.
- THE MAKER: Shyam Prajapati · potter, Bhadaini.
- THE ADDITION: "Shaped from the river, returned to it."
- IMAGES: [ ] kulhads / clay diyas · [ ] throwing on the wheel · [ ] the potter / kiln

---

## The box (needs a real, 3D feel)
The box should feel built, not pictured. Asset needs:
- [ ] OPEN box — 3/4 angle, empty, premium (indigo + gold), ideally on transparent
      or dark — so added products composite INTO it.
- [ ] CLOSED box — lid + heritage card.
- [ ] (optional) a 3D model (.glb) if we want a rotatable, true-3D box.
- [ ] For build-your-own: each product as an ISOLATED PNG (transparent bg) so it
      can drop into the open box as it's added.

## Image priority (what to generate first)
1. The 5 product shots — isolated / transparent PNG (for the box + cards).
2. One OPEN empty box (3/4 view).
3. The 5 "making" shots (the craft in the hands).
4. The 5 maker/lane shots.
Naming → /public/data/images/hriday/<slug>/{product,making,maker}.png

## Generation prompts (product shots)
Shared style (append to each): "Premium heritage e-commerce product photograph,
single subject isolated on a fully transparent background (PNG), soft warm
directional studio light from the upper-left, gentle contact shadow,
ultra-detailed realistic textures, museum-quality, elegant luxury mood, 1:1
square, centered, no text, no watermark, no hands, no people."

1. banarasi-saree — A luxurious Banarasi silk saree, softly folded and draped, in
   a deep jewel tone (royal magenta with emerald undertones), woven with intricate
   real gold and silver zari brocade — paisley buti and floral bel motifs and an
   ornate pallu border catching the light, the sheen of pure mulberry silk.
2. tamba — A hand-hammered Banaras copper-and-brass oil lamp (diya) with fine
   embossed repoussé relief, warm reddish-copper and golden-brass tones, visible
   hammer texture and a faint heritage patina.
3. paper — A neat stack of Banaras handmade cotton-rag paper with rough torn
   deckle edges in cream-ivory, a thread-stitched hand-bound journal on top, soft
   fibrous visible texture.
4. wooden-toys — A set of traditional Varanasi lacquered wooden toys (bird,
   spinning top, stylized figurine), glossy lac dyed sindoor-red, turmeric-yellow
   and leaf-green, smooth rounded forms with vivid hand-painted bands.
5. clay — A small stack of unglazed terracotta kulhads with two hand-thrown clay
   diyas beside them, raw earthy reddish-brown river clay, matte finish, subtle
   wheel-throwing rings.

