/**
 * =========================================================================
 * SMART GROCERY — KAWAII VECTOR ART COLLECTION
 * Inspired by Canva Vector Pro Elements (Chonnie Artwork Tea Party & Bakery)
 * High-definition, scalable, ultra-lightweight, 100% offline PWA compatible
 * =========================================================================
 */

const KawaiiArt = {
  // 1. Chibi Girl Avatar with Bun & Glasses (Signature Chonnie Profile Model)
  girl_bun: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="kbBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E0F2FE"/>
        <stop offset="100%" stop-color="#BAE6FD"/>
      </linearGradient>
      <linearGradient id="kbHair" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8D5B4C"/>
        <stop offset="100%" stop-color="#653E32"/>
      </linearGradient>
      <linearGradient id="kbSkin" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFF3EB"/>
        <stop offset="100%" stop-color="#FDE8DC"/>
      </linearGradient>
    </defs>
    <!-- Background Circle -->
    <circle cx="50" cy="50" r="47" fill="url(#kbBg)" stroke="#FFFFFF" stroke-width="3"/>
    <!-- Shoulders & Pink Dress -->
    <path d="M24 95 C26 78 40 76 50 76 C60 76 74 78 76 95 Z" fill="#F472B6"/>
    <path d="M42 76 L50 84 L58 76 Z" fill="#FFFFFF" opacity="0.9"/>
    <!-- Neck -->
    <rect x="45" y="68" width="10" height="10" rx="3" fill="url(#kbSkin)"/>
    <!-- Head -->
    <ellipse cx="50" cy="52" rx="22" ry="20" fill="url(#kbSkin)"/>
    <!-- Hair Bun -->
    <ellipse cx="50" cy="22" rx="15" ry="13" fill="url(#kbHair)"/>
    <!-- Cute Bun Ribbon -->
    <path d="M43 28 C45 25 48 26 50 28 C52 26 55 25 57 28 C56 31 52 30 50 29 C48 30 44 31 43 28 Z" fill="#F43F5E"/>
    <circle cx="50" cy="28" r="2.5" fill="#FFE4E6"/>
    <!-- Hair Back/Front Bangs -->
    <path d="M28 50 C27 34 36 29 50 29 C64 29 73 34 72 50 C70 41 63 35 50 35 C37 35 30 41 28 50 Z" fill="url(#kbHair)"/>
    <!-- Side Wisps -->
    <path d="M28 48 C27 58 31 65 33 67 C31 60 30 52 30 48 Z" fill="url(#kbHair)"/>
    <path d="M72 48 C73 58 69 65 67 67 C69 60 70 52 70 48 Z" fill="url(#kbHair)"/>
    <!-- Eyebrows -->
    <path d="M38 46 Q42 44 45 46" stroke="#5C382C" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    <path d="M55 46 Q58 44 62 46" stroke="#5C382C" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    <!-- Eyes Behind Glasses -->
    <circle cx="41.5" cy="52" r="2.2" fill="#2E1A14"/>
    <circle cx="40.8" cy="51.2" r="0.8" fill="#FFFFFF"/>
    <circle cx="58.5" cy="52" r="2.2" fill="#2E1A14"/>
    <circle cx="57.8" cy="51.2" r="0.8" fill="#FFFFFF"/>
    <!-- Round Glasses -->
    <circle cx="41.5" cy="52" r="7.5" fill="none" stroke="#4A342B" stroke-width="1.6"/>
    <circle cx="58.5" cy="52" r="7.5" fill="none" stroke="#4A342B" stroke-width="1.6"/>
    <path d="M49 52 L51 52" stroke="#4A342B" stroke-width="1.6" stroke-linecap="round"/>
    <!-- Blush -->
    <ellipse cx="34" cy="56" rx="4" ry="2.2" fill="#FB7185" opacity="0.6"/>
    <ellipse cx="66" cy="56" rx="4" ry="2.2" fill="#FB7185" opacity="0.6"/>
    <!-- Cute Smile -->
    <path d="M47.5 60 Q50 62.5 52.5 60" stroke="#E11D48" stroke-width="1.4" stroke-linecap="round" fill="none"/>
  </svg>`,

  // 2. Layered Strawberry Shortcake Slice with Ribbons
  strawberry_cake: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="scPlate" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#FFE4E6"/>
      </linearGradient>
    </defs>
    <!-- Scalloped Plate/Saucer -->
    <ellipse cx="50" cy="74" rx="42" ry="15" fill="url(#scPlate)" stroke="#F4BFD0" stroke-width="1.8"/>
    <!-- Cake Body (Slice) -->
    <!-- Bottom Sponge -->
    <path d="M22 62 L64 68 L78 50 L38 45 Z" fill="#FDE047" opacity="0.9"/>
    <!-- Cream Layer 1 -->
    <path d="M22 58 L64 64 L78 46 L38 41 Z" fill="#F472B6"/>
    <!-- Middle Sponge -->
    <path d="M22 53 L64 59 L78 41 L38 36 Z" fill="#FEF08A"/>
    <!-- Cream Layer 2 -->
    <path d="M22 49 L64 55 L78 37 L38 32 Z" fill="#FFFFFF"/>
    <!-- Top Sponge -->
    <path d="M22 45 L64 51 L78 33 L38 28 Z" fill="#FDE047"/>
    <!-- Top Fluffy Cream -->
    <path d="M22 45 Q38 47 64 51 L78 33 Q56 29 38 28 Z" fill="#FFFFFF" stroke="#FFE4E6" stroke-width="1"/>
    <!-- Cream Rosettes Top -->
    <circle cx="36" cy="34" r="5" fill="#FFF1F2"/>
    <circle cx="50" cy="38" r="5.5" fill="#FFF1F2"/>
    <circle cx="65" cy="42" r="5" fill="#FFF1F2"/>
    <!-- Big Ripe Strawberry on Top -->
    <path d="M45 28 C45 21 54 18 56 24 C58 18 67 21 67 28 C67 35 56 42 56 42 C56 42 45 35 45 28 Z" fill="#EF4444"/>
    <!-- Strawberry Seeds & Leaves -->
    <circle cx="51" cy="27" r="0.8" fill="#FEF08A"/>
    <circle cx="60" cy="28" r="0.8" fill="#FEF08A"/>
    <circle cx="56" cy="33" r="0.8" fill="#FEF08A"/>
    <path d="M56 20 C54 16 50 18 48 18 M56 20 C58 16 62 17 64 17 M56 20 L56 15" stroke="#4ADE80" stroke-width="2" stroke-linecap="round" fill="none"/>
    <!-- Sparkles -->
    <path d="M22 30 L24 25 L26 30 L31 32 L26 34 L24 39 L22 34 L17 32 Z" fill="#F472B6" transform="scale(0.5) translate(15, 20)"/>
    <path d="M78 20 L80 16 L82 20 L86 22 L82 24 L80 28 L78 24 L74 22 Z" fill="#FBBF24" transform="scale(0.5) translate(70, 10)"/>
  </svg>`,

  // 3. Vintage English Rose Teacup & Saucer with Rose Petals
  rose_teacup: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- Golden Lace Saucer -->
    <ellipse cx="50" cy="74" rx="42" ry="14" fill="#FEF9C3" stroke="#FBBF24" stroke-width="1.8" stroke-dasharray="3,2"/>
    <ellipse cx="50" cy="73" rx="36" ry="11" fill="#FFFFFF" stroke="#BAE6FD" stroke-width="1.5"/>
    <!-- Cup Handle -->
    <path d="M68 46 C82 46 82 66 65 67" fill="none" stroke="#FBBF24" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M68 46 C80 46 80 66 65 67" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Cup Body -->
    <path d="M26 44 C26 70 72 70 72 44 Z" fill="#FFFFFF" stroke="#93C5FD" stroke-width="1.6"/>
    <!-- Tea Surface -->
    <ellipse cx="49" cy="45" rx="22.5" ry="7.5" fill="#B45309"/>
    <ellipse cx="49" cy="45" rx="19" ry="5.5" fill="#D97706"/>
    <!-- Painted Pink Roses on Cup -->
    <circle cx="42" cy="57" r="4.5" fill="#FDA4AF"/>
    <circle cx="43" cy="56" r="2.8" fill="#F43F5E"/>
    <circle cx="56" cy="58" r="4" fill="#FDA4AF"/>
    <circle cx="55" cy="57.5" r="2.3" fill="#F43F5E"/>
    <!-- Leaves on Cup -->
    <path d="M36 57 Q38 54 40 56" stroke="#4ADE80" stroke-width="1.6" fill="none"/>
    <path d="M61 58 Q63 55 60 54" stroke="#4ADE80" stroke-width="1.6" fill="none"/>
    <!-- Gold Rim -->
    <ellipse cx="49" cy="44" rx="23.5" ry="8" fill="none" stroke="#FBBF24" stroke-width="2"/>
    <!-- Steaming Swirls -->
    <path d="M43 32 Q40 25 45 20" stroke="#FDA4AF" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.8"/>
    <path d="M53 34 Q57 27 52 21" stroke="#FDA4AF" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.8"/>
  </svg>`,

  // 4. Traditional English Tea Tin (Pastel Vintage Canister)
  english_tea_tin: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tinGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FDE047"/>
        <stop offset="50%" stop-color="#FFFBEB"/>
        <stop offset="100%" stop-color="#EAB308"/>
      </linearGradient>
    </defs>
    <!-- Soft Shadow -->
    <ellipse cx="50" cy="85" rx="32" ry="7" fill="#FCE7F3" opacity="0.8"/>
    <!-- Tin Body -->
    <rect x="25" y="32" width="50" height="50" rx="6" fill="#FFFBEB" stroke="#FDE047" stroke-width="2"/>
    <!-- Tin Lid -->
    <rect x="22" y="24" width="56" height="10" rx="4" fill="url(#tinGold)" stroke="#D97706" stroke-width="1.5"/>
    <rect x="36" y="19" width="28" height="6" rx="3" fill="url(#tinGold)" stroke="#D97706" stroke-width="1.2"/>
    <!-- Decorative Label Box -->
    <rect x="30" y="39" width="40" height="36" rx="4" fill="#FFFFFF" stroke="#F472B6" stroke-width="1.4" stroke-dasharray="2,1"/>
    <!-- Label Typography / Details -->
    <text x="50" y="47" font-family="'Playfair Display', serif" font-size="5" font-weight="bold" fill="#831843" text-anchor="middle">TRADITIONAL</text>
    <text x="50" y="56" font-family="'Playfair Display', serif" font-size="7.5" font-weight="900" fill="#BE185D" text-anchor="middle">ENGLISH</text>
    <text x="50" y="64" font-family="'Playfair Display', serif" font-size="7.5" font-weight="900" fill="#BE185D" text-anchor="middle">TEA</text>
    <!-- Pink Floral Accent in Label -->
    <circle cx="50" cy="70" r="2.5" fill="#FB7185"/>
    <path d="M46 70 Q48 68 50 70 Q52 68 54 70" stroke="#4ADE80" stroke-width="1" fill="none"/>
  </svg>`,

  // 5. Classic Pastel Floral Teapot (With Rose Pattern & Gold Finial)
  porcelain_teapot: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- Golden Lace Base -->
    <ellipse cx="48" cy="82" rx="36" ry="11" fill="#FEF9C3" stroke="#FBBF24" stroke-width="1.6" stroke-dasharray="3,2"/>
    <!-- Teapot Handle -->
    <path d="M64 45 C86 45 84 74 60 72" fill="none" stroke="#BAE6FD" stroke-width="6" stroke-linecap="round"/>
    <path d="M64 45 C84 45 82 74 60 72" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
    <!-- Teapot Spout -->
    <path d="M30 62 C16 62 14 42 22 36 C24 38 28 46 34 50 Z" fill="#BAE6FD" stroke="#93C5FD" stroke-width="1.5"/>
    <!-- Main Belly Body -->
    <ellipse cx="48" cy="58" rx="25" ry="21" fill="#FFFFFF" stroke="#93C5FD" stroke-width="2"/>
    <!-- Lower Gold Ring -->
    <ellipse cx="48" cy="77" rx="15" ry="4" fill="#FEF08A" stroke="#EAB308" stroke-width="1.2"/>
    <!-- Painted Pink Roses -->
    <circle cx="44" cy="58" r="5" fill="#FDA4AF"/>
    <circle cx="45" cy="57" r="3" fill="#E11D48"/>
    <circle cx="54" cy="60" r="4.2" fill="#FDA4AF"/>
    <circle cx="53.5" cy="59.5" r="2.2" fill="#E11D48"/>
    <path d="M38 58 Q41 54 44 57" stroke="#4ADE80" stroke-width="1.6" fill="none"/>
    <path d="M59 60 Q62 56 57 55" stroke="#4ADE80" stroke-width="1.6" fill="none"/>
    <!-- Teapot Lid -->
    <path d="M36 39 Q48 33 60 39 Z" fill="#BAE6FD" stroke="#93C5FD" stroke-width="1.5"/>
    <ellipse cx="48" cy="39" rx="12" ry="3.5" fill="#FEF08A" stroke="#EAB308" stroke-width="1"/>
    <!-- Gold Finial Knob -->
    <circle cx="48" cy="30" r="4" fill="#FBBF24" stroke="#D97706" stroke-width="1.2"/>
  </svg>`,

  // 6. Golden Croissant with Magenta Pink Ribbon Bow
  ribbon_croissant: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="crGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FEF08A"/>
        <stop offset="40%" stop-color="#FCD34D"/>
        <stop offset="100%" stop-color="#D97706"/>
      </linearGradient>
    </defs>
    <!-- Soft Pink Shadow -->
    <ellipse cx="50" cy="80" rx="35" ry="8" fill="#FFE4E6"/>
    <!-- Croissant Crescent Curved Body -->
    <path d="M20 68 C15 48 26 32 46 28 C66 24 82 40 82 62 C78 68 70 66 66 58 C62 46 54 40 44 42 C34 44 26 56 26 66 Z" fill="url(#crGold)" stroke="#B45309" stroke-width="2"/>
    <!-- Flaky Segments/Roll Cuts -->
    <path d="M36 32 C38 42 39 52 32 62" stroke="#B45309" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M50 28 C52 40 54 50 48 58" stroke="#B45309" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M65 30 C66 40 68 48 64 56" stroke="#B45309" stroke-width="2" stroke-linecap="round" fill="none"/>
    <!-- Cute Pink Ribbon Tied Around Center -->
    <path d="M47 38 C54 36 56 46 47 48 Z" fill="#F43F5E"/>
    <!-- Bow Loops -->
    <path d="M40 37 C34 32 32 44 42 42 Z" fill="#F43F5E"/>
    <path d="M55 37 C61 32 63 44 53 42 Z" fill="#F43F5E"/>
    <!-- Bow Knot -->
    <circle cx="47.5" cy="40" r="3" fill="#FDA4AF" stroke="#E11D48" stroke-width="1"/>
    <!-- Ribbon Tails -->
    <path d="M46 43 Q43 50 41 54" stroke="#F43F5E" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M49 43 Q52 50 54 54" stroke="#F43F5E" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  </svg>`,

  // 7. Strawberry Cupcake with Rose & Swirl Cream
  strawberry_cupcake: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- Shadow -->
    <ellipse cx="50" cy="85" rx="28" ry="7" fill="#FFE4E6"/>
    <!-- Pleated Cupcake Liner -->
    <path d="M32 55 L38 82 C38 84 62 84 62 82 L68 55 Z" fill="#E0F2FE" stroke="#7DD3FC" stroke-width="1.8"/>
    <!-- Liner Pleat Lines -->
    <line x1="39" y1="56" x2="43" y2="82" stroke="#BAE6FD" stroke-width="1.6"/>
    <line x1="46" y1="56" x2="48" y2="83" stroke="#BAE6FD" stroke-width="1.6"/>
    <line x1="54" y1="56" x2="52" y2="83" stroke="#BAE6FD" stroke-width="1.6"/>
    <line x1="61" y1="56" x2="57" y2="82" stroke="#BAE6FD" stroke-width="1.6"/>
    <!-- Swirled Strawberry Cream -->
    <ellipse cx="50" cy="55" rx="24" ry="12" fill="#FCE7F3" stroke="#F472B6" stroke-width="1.6"/>
    <ellipse cx="50" cy="46" rx="19" ry="10" fill="#FFF1F2" stroke="#FDA4AF" stroke-width="1.6"/>
    <ellipse cx="50" cy="37" rx="13" ry="7" fill="#FFFFFF" stroke="#FECDD3" stroke-width="1.4"/>
    <!-- Small Pink Rose -->
    <circle cx="43" cy="38" r="4" fill="#FDA4AF"/>
    <circle cx="43.5" cy="37.5" r="2" fill="#E11D48"/>
    <!-- Ripe Strawberry -->
    <path d="M50 25 C50 19 56 16 58 21 C60 16 66 19 66 25 C66 31 58 37 58 37 C58 37 50 31 50 25 Z" fill="#EF4444"/>
    <circle cx="55" cy="24" r="0.7" fill="#FEF08A"/>
    <circle cx="61" cy="25" r="0.7" fill="#FEF08A"/>
    <path d="M58 18 L58 14 M58 18 C56 16 53 17 53 17 M58 18 C60 16 63 17 63 17" stroke="#4ADE80" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  </svg>`,

  // 8. Afternoon Tea Macaron & Pastry Stand (2-Tier Golden Stand)
  macaron_tier: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- Golden Central Pillar -->
    <line x1="50" y1="18" x2="50" y2="86" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/>
    <!-- Top Ring Handle -->
    <circle cx="50" cy="14" r="6" fill="none" stroke="#FBBF24" stroke-width="2.5"/>
    <!-- Bottom Wide Plate -->
    <ellipse cx="50" cy="84" rx="42" ry="9" fill="#FFFFFF" stroke="#FBBF24" stroke-width="2"/>
    <!-- Top Smaller Plate -->
    <ellipse cx="50" cy="54" rx="28" ry="6.5" fill="#FFFFFF" stroke="#FBBF24" stroke-width="1.8"/>
    <!-- Macarons on Bottom Tier -->
    <!-- Pink Macaron -->
    <ellipse cx="32" cy="80" rx="7" ry="3.5" fill="#FDA4AF"/>
    <rect x="25" y="79" width="14" height="2" fill="#FFFFFF"/>
    <!-- Yellow Macaron -->
    <ellipse cx="48" cy="81" rx="7" ry="3.5" fill="#FEF08A"/>
    <rect x="41" y="80" width="14" height="2" fill="#F472B6"/>
    <!-- Mint/Blue Macaron -->
    <ellipse cx="64" cy="80" rx="7" ry="3.5" fill="#BAE6FD"/>
    <rect x="57" y="79" width="14" height="2" fill="#FFFFFF"/>
    <!-- Cupcakes on Top Tier -->
    <ellipse cx="38" cy="50" rx="6" ry="4" fill="#FCE7F3"/>
    <circle cx="38" cy="46" r="1.8" fill="#EF4444"/>
    <ellipse cx="62" cy="50" rx="6" ry="4" fill="#FFF1F2"/>
    <circle cx="62" cy="46" r="1.8" fill="#EF4444"/>
  </svg>`,

  // 9. Heart Cookie with Baby Blue Ribbon
  heart_cookie: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- Soft Shadow -->
    <ellipse cx="50" cy="82" rx="30" ry="8" fill="#FFE4E6"/>
    <!-- Scalloped Heart Biscuit Outer -->
    <path d="M50 78 C25 60 16 42 22 28 C28 15 44 18 50 28 C56 18 72 15 78 28 C84 42 75 60 50 78 Z" fill="#FEF08A" stroke="#F59E0B" stroke-width="2"/>
    <!-- Heart Biscuit Inner Crust -->
    <path d="M50 72 C29 56 22 40 27 29 C32 18 45 21 50 30 C55 21 68 18 73 29 C78 40 71 56 50 72 Z" fill="#FFFBEB"/>
    <!-- Embossed Jam Heart Well -->
    <path d="M50 63 C36 51 32 40 35 33 C38 26 46 28 50 34 C54 28 62 26 65 33 C68 40 64 51 50 63 Z" fill="#F43F5E" opacity="0.9"/>
    <!-- Cute Baby Blue Ribbon Bow at Top -->
    <path d="M42 22 C34 16 32 28 44 26 Z" fill="#38BDF8"/>
    <path d="M58 22 C66 16 68 28 56 26 Z" fill="#38BDF8"/>
    <circle cx="50" cy="24" r="3.2" fill="#BAE6FD" stroke="#0284C7" stroke-width="1"/>
    <path d="M48 27 Q44 34 40 38" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M52 27 Q56 34 60 38" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  </svg>`,

  // 10. Straw Sunhat with Flowing Pink Ribbon
  straw_sunhat: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shStraw" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FEF08A"/>
        <stop offset="100%" stop-color="#FCD34D"/>
      </linearGradient>
    </defs>
    <!-- Shadow -->
    <ellipse cx="50" cy="78" rx="42" ry="11" fill="#FFE4E6"/>
    <!-- Wide Brim -->
    <ellipse cx="50" cy="66" rx="44" ry="18" fill="url(#shStraw)" stroke="#D97706" stroke-width="1.8"/>
    <!-- Crown Dome -->
    <path d="M30 60 C30 36 70 36 70 60 Z" fill="url(#shStraw)" stroke="#D97706" stroke-width="1.8"/>
    <!-- Pink Ribbon Band Around Crown -->
    <path d="M30 58 Q50 64 70 58 L70 63 Q50 69 30 63 Z" fill="#F472B6"/>
    <!-- Big Bow on Ribbon -->
    <path d="M42 62 C34 56 32 68 44 66 Z" fill="#F43F5E"/>
    <path d="M58 62 C66 56 68 68 56 66 Z" fill="#F43F5E"/>
    <circle cx="50" cy="64" r="3.5" fill="#FDA4AF" stroke="#E11D48" stroke-width="1"/>
    <!-- Flowing Ribbon Tails -->
    <path d="M47 67 Q42 76 38 82" stroke="#F43F5E" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M53 67 Q58 76 62 82" stroke="#F43F5E" stroke-width="3" stroke-linecap="round" fill="none"/>
  </svg>`,

  // 11. Cute Teabag with Heart Pouch
  tea_bag_heart: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- Teabag Pouch -->
    <path d="M32 40 L42 26 L58 26 L68 40 L68 80 L32 80 Z" fill="#FFF1F2" stroke="#FDA4AF" stroke-width="2"/>
    <!-- Teabag Tag String -->
    <path d="M50 26 Q50 12 66 14 Q78 16 76 26" stroke="#F59E0B" stroke-width="1.8" fill="none"/>
    <!-- Teabag Tag -->
    <rect x="70" y="24" width="14" height="14" rx="3" fill="#FEF08A" stroke="#D97706" stroke-width="1.2"/>
    <circle cx="77" cy="31" r="2.5" fill="#F43F5E"/>
    <!-- Sweet Hearts Pattern on Pouch -->
    <path d="M42 46 C40 43 44 42 45 44 C46 42 50 43 48 46 L45 49 Z" fill="#F43F5E"/>
    <path d="M54 54 C52 51 56 50 57 52 C58 50 62 51 60 54 L57 57 Z" fill="#F43F5E"/>
    <path d="M42 64 C40 61 44 60 45 62 C46 60 50 61 48 64 L45 67 Z" fill="#F43F5E"/>
    <!-- Little Pink Bow at Top of Teabag -->
    <circle cx="50" cy="33" r="2.5" fill="#FB7185"/>
    <path d="M46 31 C43 27 45 35 49 34 Z" fill="#FB7185"/>
    <path d="M54 31 C57 27 55 35 51 34 Z" fill="#FB7185"/>
  </svg>`,

  // 12. Bouquet of Pink Roses in Vintage Porcelain Jug
  rose_bouquet: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- Porcelain Jug Base -->
    <ellipse cx="50" cy="86" rx="24" ry="6" fill="#FFE4E6"/>
    <!-- Jug Body -->
    <path d="M36 60 Q34 84 50 84 Q66 84 64 60 Z" fill="#FFFFFF" stroke="#93C5FD" stroke-width="1.8"/>
    <!-- Jug Neck -->
    <path d="M40 50 L38 60 L62 60 L60 50 Z" fill="#FFFFFF" stroke="#93C5FD" stroke-width="1.8"/>
    <!-- Blue Floral Ornament on Jug -->
    <circle cx="50" cy="72" r="3.5" fill="#93C5FD"/>
    <circle cx="50" cy="72" r="1.8" fill="#1D4ED8"/>
    <!-- Sage Green Leaves -->
    <path d="M30 46 C24 38 34 32 38 40 Z" fill="#86EFAC"/>
    <path d="M68 44 C76 38 72 30 64 38 Z" fill="#86EFAC"/>
    <path d="M50 36 C52 26 44 26 46 34 Z" fill="#86EFAC"/>
    <!-- Blooming Soft Pink Roses -->
    <!-- Rose 1 -->
    <circle cx="38" cy="42" r="8.5" fill="#FDA4AF"/>
    <circle cx="38" cy="41" r="5.5" fill="#FB7185"/>
    <circle cx="38.5" cy="40.5" r="3" fill="#E11D48"/>
    <!-- Rose 2 (Center High) -->
    <circle cx="50" cy="32" r="9.5" fill="#FDA4AF"/>
    <circle cx="50" cy="31" r="6" fill="#FB7185"/>
    <circle cx="50.5" cy="30.5" r="3.2" fill="#E11D48"/>
    <!-- Rose 3 -->
    <circle cx="62" cy="42" r="8.5" fill="#FDA4AF"/>
    <circle cx="62" cy="41" r="5.5" fill="#FB7185"/>
    <circle cx="61.5" cy="40.5" r="3" fill="#E11D48"/>
  </svg>`,

  // 13. Beras Rojolele (Supermarket Staple)
  staple_rice: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="82" rx="30" ry="7" fill="#FFE4E6"/>
    <!-- Rice Sack -->
    <path d="M28 44 C26 76 34 82 50 82 C66 82 74 76 72 44 C72 38 28 38 28 44 Z" fill="#FFFBEB" stroke="#FDE047" stroke-width="2"/>
    <!-- Sack Top Ruffled Opening -->
    <path d="M26 40 Q50 35 74 40 Q50 45 26 40 Z" fill="#FEF08A" stroke="#EAB308" stroke-width="1.6"/>
    <ellipse cx="50" cy="40" rx="20" ry="4" fill="#FFFFFF"/>
    <!-- Wheat Stalks -->
    <path d="M50 40 L50 20" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="46" cy="24" rx="2.5" ry="4" fill="#FBBF24" transform="rotate(-30 46 24)"/>
    <ellipse cx="54" cy="24" rx="2.5" ry="4" fill="#FBBF24" transform="rotate(30 54 24)"/>
    <ellipse cx="46" cy="30" rx="2.5" ry="4" fill="#FBBF24" transform="rotate(-30 46 30)"/>
    <ellipse cx="54" cy="30" rx="2.5" ry="4" fill="#FBBF24" transform="rotate(30 54 30)"/>
    <!-- Label on Sack -->
    <rect x="36" y="52" width="28" height="18" rx="4" fill="#FFFFFF" stroke="#F472B6" stroke-width="1.2"/>
    <text x="50" y="61" font-size="6.5" font-weight="900" fill="#BE185D" text-anchor="middle">BERAS</text>
    <text x="50" y="68" font-size="5" font-weight="bold" fill="#059669" text-anchor="middle">ROJOLELE 5kg</text>
    <!-- Cute Pink Bow -->
    <circle cx="50" cy="45" r="2.5" fill="#F43F5E"/>
    <path d="M46 43 C42 40 44 48 48 46 Z" fill="#F43F5E"/>
    <path d="M54 43 C58 40 56 48 52 46 Z" fill="#F43F5E"/>
  </svg>`,

  // 14. Susu UHT Ultra Milk (Pastel Kawaii Cow Milk Carton)
  dairy_milk: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="85" rx="26" ry="6" fill="#FFE4E6"/>
    <!-- Milk Carton Body -->
    <rect x="32" y="38" width="36" height="46" rx="4" fill="#FFFFFF" stroke="#93C5FD" stroke-width="2"/>
    <!-- Gable Top Roof -->
    <path d="M32 38 L42 24 L58 24 L68 38 Z" fill="#BAE6FD" stroke="#60A5FA" stroke-width="1.8"/>
    <!-- Top Pinch Fold -->
    <rect x="42" y="20" width="16" height="5" fill="#93C5FD" stroke="#3B82F6" stroke-width="1"/>
    <!-- Pink Strawberry Splash Stripe -->
    <rect x="32" y="56" width="36" height="14" fill="#FCE7F3"/>
    <text x="50" y="66" font-size="7" font-weight="900" fill="#BE185D" text-anchor="middle">MILK 1L</text>
    <!-- Cute Strawberry Icon on Carton -->
    <circle cx="50" cy="47" r="4.5" fill="#EF4444"/>
    <circle cx="49" cy="46" r="0.8" fill="#FEF08A"/>
    <circle cx="51.5" cy="47.5" r="0.8" fill="#FEF08A"/>
    <path d="M50 42 L50 40 M48 41 L52 41" stroke="#22C55E" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,

  // 15. Indomie Goreng (Kawaii Steaming Noodle Bowl)
  staple_noodle: `<svg viewBox="0 0 100 100" class="kawaii-art-svg" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="80" rx="36" ry="10" fill="#FFE4E6"/>
    <!-- Pastel Bowl -->
    <path d="M22 46 C22 74 78 74 78 46 Z" fill="#FFE4E6" stroke="#F43F5E" stroke-width="2"/>
    <!-- Bowl Rim -->
    <ellipse cx="50" cy="46" rx="28" ry="8" fill="#FEF08A" stroke="#EAB308" stroke-width="1.8"/>
    <!-- Curly Noodle Swirls -->
    <path d="M30 46 Q35 40 40 46 Q45 40 50 46 Q55 40 60 46 Q65 40 70 46" stroke="#F59E0B" stroke-width="2.5" fill="none"/>
    <path d="M32 43 Q37 38 42 43 Q47 38 52 43 Q57 38 62 43 Q67 38 68 43" stroke="#FBBF24" stroke-width="2" fill="none"/>
    <!-- Fried Egg Sunny Side Up -->
    <ellipse cx="50" cy="45" rx="8" ry="5.5" fill="#FFFFFF"/>
    <circle cx="50" cy="45" r="3.5" fill="#F59E0B"/>
    <!-- Chopsticks -->
    <line x1="68" y1="22" x2="42" y2="52" stroke="#B45309" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="74" y1="24" x2="48" y2="54" stroke="#B45309" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`
};

/**
 * Array metadata untuk Preset Avatar Modal (12 model Canva Vector Style)
 */
const KAWAII_AVATAR_PRESETS = [
  { id: 'girl_bun', name: 'Chonnie Bun Girl', title: 'Chonnie Bun Girl 👧', svgKey: 'girl_bun' },
  { id: 'strawberry_cake', name: 'Strawberry Shortcake', title: 'Strawberry Shortcake 🍰', svgKey: 'strawberry_cake' },
  { id: 'rose_teacup', name: 'Rose Teacup', title: 'English Rose Teacup ☕', svgKey: 'rose_teacup' },
  { id: 'english_tea_tin', name: 'English Tea Canister', title: 'English Tea Canister 🫖', svgKey: 'english_tea_tin' },
  { id: 'porcelain_teapot', name: 'Porcelain Teapot', title: 'Floral Teapot 🫖', svgKey: 'porcelain_teapot' },
  { id: 'ribbon_croissant', name: 'Ribbon Croissant', title: 'Ribbon Croissant 🥐', svgKey: 'ribbon_croissant' },
  { id: 'strawberry_cupcake', name: 'Strawberry Cupcake', title: 'Strawberry Cupcake 🧁', svgKey: 'strawberry_cupcake' },
  { id: 'macaron_tier', name: 'Macaron Tier Stand', title: 'Afternoon Tea Tier 🧁', svgKey: 'macaron_tier' },
  { id: 'heart_cookie', name: 'Heart Jam Cookie', title: 'Heart Jam Cookie 🍪', svgKey: 'heart_cookie' },
  { id: 'straw_sunhat', name: 'Straw Sunhat', title: 'Straw Sunhat 👒', svgKey: 'straw_sunhat' },
  { id: 'tea_bag_heart', name: 'Heart Teabag Pouch', title: 'Heart Teabag Pouch 🫖', svgKey: 'tea_bag_heart' },
  { id: 'rose_bouquet', name: 'Pink Rose Bouquet', title: 'Pink Rose Bouquet 💐', svgKey: 'rose_bouquet' }
];

/**
 * Helper untuk mendapatkan data URL dari SVG KawaiiArt
 */
function getKawaiiArtDataUrl(artKey) {
  const svg = KawaiiArt[artKey];
  if (!svg) return '';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

if (typeof window !== 'undefined') {
  window.KawaiiArt = KawaiiArt;
  window.KAWAII_AVATAR_PRESETS = KAWAII_AVATAR_PRESETS;
  window.getKawaiiArtDataUrl = getKawaiiArtDataUrl;
}
if (typeof module !== 'undefined') {
  module.exports = { KawaiiArt, KAWAII_AVATAR_PRESETS, getKawaiiArtDataUrl };
}
