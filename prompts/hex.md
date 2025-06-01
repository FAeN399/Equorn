🌟 **Crystal-Mandala Layout Spec (v2 – Purple Core)**

16. **Adopt the Six-Point Mandala Geometry**  
   - **Core Eye:** 1 perfect circle (radius ≈ 75 px desktop) with a *lavender iris* `#9B7DCE` and a *deep-plum pupil* `#4B286D`.  
     • Apply a radial glow **from `#B493E8` at 0 % → transparent by 100 %** for an amethyst aura.  
   - **Golden Star Layer:** Place **6 identical kite-shaped cells** (SVG path or `clip-path`) radiating at **60 ° increments**. `--hexSize` defines edge length; fill `#FFC84A → #F4A534` gradient with 6 px inner bevel.  
   - **Inner Hex Ring (Blue):** Ring of **18 regular hexes** (`--hexSize`). Color `#1A6C92`; overlay faint grid (`stroke: rgba(255,255,255,.05)`).  
   - **Ruby Diamond Points:** At each star tip, overlay a red diamond gem. Color `#EF3B24`, inner glow `#FF8157`, thin emissive outline.  
   - **Obsidian Capacitors:** Behind the diamonds, seat **6 dark trapezoidal blocks** `#272321`, angled toward center.  
   - **Ether-Cables:** Connect each capacitor pair with an animated Bézier SVG path (`stroke: #2F3F2E; stroke-width: 3`). Slow green-teal pulses travel clockwise every 5 s.

17. **Component Hierarchy & Layers (highest → lowest)**  
   1. Drag-and-drop Essence Card (while hovering)  
   2. Ruby Diamonds  
   3. Obsidian Capacitors  
   4. Blue Hex Ring  
   5. Golden Star  
   6. **Purple Core Eye**  
   7. Canvas lattice background  

18. **Precise Positioning Algorithm**  
```pseudo
const center   = { x: panelWidth / 2, y: panelHeight / 2 };
const rStar    = clamp(panelWidth * 0.11, 60, 120);   // distance to star tips
const rHexRing = rStar + (1.25 * hexSize);
const rDiamond = rStar + (0.60 * hexSize);
const rCap     = rDiamond + (0.55 * hexSize);

for i = 0..5:
    angle = i * 60deg - 90deg;
    placeStarKite(angle, rStar);
    placeBlueHexCluster(angle, rHexRing);
    placeDiamond(angle, rDiamond);
    placeCapacitor(angle, rCap);
    connectCable(i, (i + 1) % 6, rCap);
🌟 **Crystal-Mandala Layout Spec (v2 – Purple Core)**

16. **Adopt the Six-Point Mandala Geometry**  
    - **Core Eye:** 1 perfect circle (radius ≈ 75 px desktop) with a *lavender iris* `#9B7DCE` and a *deep-plum pupil* `#4B286D`.  
      • Apply a subtle radial glow **from `#B493E8` at 0 % → transparent by 100 %** for an amethyst aura.  
    - **Golden Star Layer:** Place **6 identical kite-shaped cells** (SVG path or clip-path) radiating at **60 ° increments**. Hex-edge length = `var(--hexSize)`, with fill `#FFC84A → #F4A534` gradient and 6 px inner bevel.  
    - **Inner Hex Ring (Blue):** Surround the star with a ring of **18 regular hexes** (`--hexSize`). Color `#1A6C92`, topped with a faint grid line pattern (`stroke: rgba(255,255,255,.05)`).  
    - **Ruby Diamond Points:** At each star tip, overlay a **red diamond gem** (SVG path). Color `#EF3B24`, inner glow `#FF8157`, thin emissive outline.  
    - **Obsidian Capacitors:** Behind the diamonds, seat **6 dark trapezoidal blocks** (`#272321`), each slightly larger than the diamond, angled toward the mandala center.  
    - **Ether-Cables:** Tie each capacitor pair with an animated Bézier SVG path (`stroke: #2F3F2E; stroke-width: 3`). Add slow green-teal pulses traveling clockwise every 5 s to suggest power flow.

17. **Component Hierarchy & Layers (Z-index top→bottom)**  
    1. Drag-and-drop Essence Card (while hovering)  
    2. Ruby Diamonds  
    3. Obsidian Capacitors  
    4. Blue Hex Ring  
    5. Golden Star  
    6. **Purple Core Eye**  
    7. Canvas lattice background  

18. **Precise Positioning Algorithm**  
```pseudo
const center   = { x: panelWidth/2, y: panelHeight/2 };
const rStar    = clamp(panelWidth * 0.11, 60, 120);   // distance to star tips
const rHexRing = rStar + (1.25 * hexSize);
const rDiamond = rStar + (0.60 * hexSize);
const rCap     = rDiamond + (0.55 * hexSize);

for i = 0..5:
    angle = i * 60deg - 90deg;
    placeStarKite(angle, rStar);
    placeBlueHexCluster(angle, rHexRing);
    placeDiamond(angle, rDiamond);
    placeCapacitor(angle, rCap);
    connectCable(i, (i+1)%6, rCap);
