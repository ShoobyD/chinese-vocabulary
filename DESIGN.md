---
name: לימוד סינית
description: Chinese vocabulary for Hebrew speakers, laid out as mahjong tiles on a felt table.
colors:
  jade-950: "#072a22"
  jade-900: "#0a3a2f"
  jade-800: "#0f4f40"
  jade-700: "#1b6b57"
  jade-200: "#bfd9cd"
  jade-100: "#dcebe4"
  bone: "#f1ece0"
  bone-shade: "#d8cfba"
  bone-deep: "#b9ae95"
  felt: "#e4ddcc"
  felt-deep: "#d6cdb8"
  felt-well: "#cbc0a5"
  ink: "#1a1a1a"
  ink-soft: "#3d3a33"
  ink-muted: "#5d574b"
  carve-red: "#b8232b"
  carve-green: "#17683b"
  carve-blue: "#1d4f9a"
  carve-black: "#1a1a1a"
  verdict-good-fill: "#e2efe6"
  verdict-good-deep: "#0f4a29"
  verdict-bad-fill: "#f6e1e1"
  verdict-bad-deep: "#7d161c"
typography:
  hanzi-display:
    fontFamily: "Noto Serif SC, Songti SC, SimSun, serif"
    fontSize: "4.5rem"
    fontWeight: 700
    lineHeight: 1.15
  hanzi-tile:
    fontFamily: "Noto Serif SC, Songti SC, SimSun, serif"
    fontSize: "3.25rem"
    fontWeight: 700
    lineHeight: 1
  title:
    fontFamily: "Assistant, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1.1
  pinyin:
    fontFamily: "Assistant, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Assistant, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Assistant, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.35
  label:
    fontFamily: "Assistant, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
components:
  word-tile:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 12px"
  flip-tile-back:
    backgroundColor: "{colors.jade-800}"
    textColor: "{colors.bone}"
    rounded: "{rounded.lg}"
    padding: "32px 24px"
    width: "20rem"
  flip-tile-face:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "32px 24px"
    width: "20rem"
  button:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    typography: "{typography.pinyin}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "44px"
  button-primary:
    backgroundColor: "{colors.jade-800}"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "44px"
  button-quiet:
    textColor: "{colors.jade-800}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "40px"
  button-quiet-hover:
    backgroundColor: "{colors.felt-deep}"
  tab-well:
    backgroundColor: "{colors.jade-900}"
    rounded: "{rounded.md}"
    padding: "4px"
  tab:
    textColor: "{colors.jade-200}"
    padding: "0 24px"
    height: "44px"
  tab-hover:
    backgroundColor: "{colors.jade-700}"
    textColor: "{colors.bone}"
  tab-active:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
  chip:
    textColor: "{colors.bone}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  chip-hover:
    backgroundColor: "{colors.jade-700}"
  chip-active:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
  input-well:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "48px"
  word-tag:
    backgroundColor: "{colors.jade-100}"
    textColor: "{colors.jade-900}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
  dialog-tile:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "48px 24px 32px"
    width: "28rem"
  tooltip-tile:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  empty-well:
    backgroundColor: "{colors.felt-deep}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.lg}"
    padding: "48px 16px"
---

# Design System: לימוד סינית

## Overview

**Creative North Star: "The Mahjong Table"**

Every word is a mahjong tile with real thickness: a carved bone face resting on a jade back, set out on a warm felt table inside a jade-green shell. The Hanzi is carved large on the face, and beneath it each syllable's tone is drawn as a short pitch contour in the tile's own carving inks. Pinyin and Hebrew sit below in a humanist sans. Hebrew reads right to left; Hanzi, Pinyin and the contours run left to right, isolated per element.

Density is a study table, not a dashboard: a loose grid of tiles with generous gutters, one large tile in Flashcards, one question tile in Quiz. Depth is physical and stacked rather than blurred: tiles lift on hover, press on click, flip to reveal and land on a verdict, and the jade underside grows or shrinks with them. The system rejects the category default it replaced: flat white rounded cards on a grey ground with a single blue accent.

The memorable moment is the tone write: hovering, focusing, flipping or opening a tile redraws its contours one syllable after another, in reading order.

**Key Characteristics:**
- Bone tile faces on visible jade undersides; every interactive surface is a tile, a well, or the felt.
- Jade shell (header) over a felt table (content) with a soft inset at their seam.
- Four carving inks, reserved for tones (contours and Pinyin syllables): 1 red flat, 2 green rising, 3 blue dipping, 4 black falling.
- Serif Hanzi (Noto Serif SC 700) beside humanist sans Hebrew and Pinyin (Assistant).
- Spring motion for tile physics only; everything else eases out.

## Colors

A jade, bone and felt material palette, with four small carving inks that mean tones and nothing else.

### Primary
- **Table Jade** (jade-800): the shell background, tile undersides (first layer), primary buttons, focus outlines, selection, caret, link and score accents. Its family carries the world: **Jade Well** (jade-900) for sunken wells and the deeper underside layer, **Deepest Jade** (jade-950) for the darkest underside edge and as the base of every overlay and shadow tint (`rgba(7, 42, 34, …)`), **Rim Jade** (jade-700) for hover fills and chip outlines on the shell, **Pale Jade** (jade-200) for muted text on jade and the focus halo on inputs, **Jade Wash** (jade-100) for word-tag fills inside the dialog.

### Secondary
- **Carved Bone** (bone): every tile face, the active tab, the selected chip, input wells, the dialog and tooltip. Also the text colour on jade. **Bone Edge** (bone-shade) is the inset bottom lip of a face and its hairline dividers; **Old Bone** (bone-deep) is the second underside layer under jade buttons, the carved seam between a word's sub-word parts (e.g. 早|上; a short groove over the middle of the glyph height, an Old Bone shadow edge beside a pale highlight; no underline, a Jade Wash fill on hover) and input hover borders.

### Tertiary
- **Carving Red** (carve-red): tone 1, high flat.
- **Carving Green** (carve-green): tone 2, rising.
- **Carving Blue** (carve-blue): tone 3, dipping.
- **Carving Black** (carve-black): tone 4, falling. Same value as ink, but a distinct role.

### Neutral
- **Felt** (felt): the table under the content area and the page background. The table carries a nap (`--felt-nap`): a fine warm-umber fractal noise plus a faint falloff toward its lower edge, so it reads as cloth rather than paper. Wells and tiles stay untextured.
- **Deep Felt** (felt-deep): input borders, quiet-button hover.
- **Well Felt** (felt-well): sunken empty-state wells, with `--well-inset` (a deeper inset shadow plus a pale lower lip). A step darker than the napped table, which itself reads close to Deep Felt, so a well never blends into it.
- **Ink** (ink): all body text and every Hanzi on a bone face.
- **Soft Ink** (ink-soft): Pinyin separators and standalone Pinyin (quiz options), Hebrew glosses on tiles, empty-state copy.
- **Muted Ink** (ink-muted): counts, field labels, progress, placeholders, footer, and the neutral-tone dot (tone 0).

### Named Rules
**The Carving Ink Rule.** The four carving inks are reserved for tones (1 red, 2 green, 3 blue, 4 black; the neutral tone is a short ink-muted dot): the contours, and the Pinyin syllables that spell the same tones. They never decorate, never mark a brand, never colour a heading.

**The Verdict Exception.** Quiz verdicts may borrow carving green (correct) and carving red (wrong), but only through a tile's fill, edge, underside and check/cross icon, and the verdict line. Never on a Hanzi glyph.

**The Ink Hanzi Rule.** Hanzi are ink on a bone face (and inlaid in bone on the jade back of a flashcard). A Hanzi glyph never takes a carving ink.

**The Tone-Inked Pinyin Rule.** Where a word's Pinyin is shown with its Hanzi, each syllable is inked in its own tone colour (`PinyinText`), matching the contour above it: the carving inks are the tone, wherever the tone is written. Separators and neutral-tone syllables stay Soft Ink / Muted Ink; weight 600. Pinyin that stands alone, such as quiz answer options, stays Soft Ink. Never jade: it sits too close to tone 2 green.

## Typography

**Display Font:** Noto Serif SC 700 (with Songti SC, SimSun, serif), loaded from Google Fonts; used only for Hanzi.
**Body Font:** Assistant 400/600/700 (with system-ui, -apple-system, Segoe UI, sans-serif) for Hebrew, Pinyin, and all UI.

**Character:** A carved, heavy serif for the characters against a calm humanist sans that handles Hebrew and Pinyin diacritics with equal weight; the serif is the tile's carving, the sans is the label beside it.

### Hierarchy
- **Hanzi display** (700, 4.5rem, 1.15): the dialog headline and quiz prompt tile; flashcards reach 7rem on the jade back. Steps down by character count (1, 2, 3, 4+) so a tile never wraps.
- **Hanzi tile** (700, 3.25rem single character down to 1.6rem for four, line-height 1): the browse grid, inside a fixed 4.25rem band so contours align across tiles.
- **Title** (700, 1.625rem, 1.1): brand name, quiz completion line, large Pinyin on the dialog.
- **Pinyin** (600, 1.0625rem, 1.3): under every tile's contours; 2rem on the flashcard face.
- **Body** (400, 1.0625rem, 1.5): inputs, empty-state text, verdicts (600).
- **Body small** (400, 0.9375rem, 1.35): Hebrew gloss on tiles, chips, counts, footer.
- **Label** (600, 0.8125rem): quiz field labels and word tags inside the dialog.

The UI scale is a fixed rem ramp: 0.8125, 0.9375, 1.0625, 1.25, 1.625rem.

### Named Rules
**The Count-Steps Rule.** Hanzi size is chosen by character count, not by container queries or wrapping: every tile, prompt and flip face keeps its word on one line. Every Hanzi size is a step of the `--hanzi-*` scale: 1 = 1.6rem, 2 = 2rem, 3 = 2.5rem, 4 = 2.75rem, 5 = 3.25rem, 6 = 3.5rem, 7 = 4.5rem, 8 = 5rem, 9 = 6rem (the display ceiling). No literal Hanzi sizes.

**The Isolation Rule.** Hebrew is tagged `dir="rtl"`; Hanzi, Pinyin and contours are tagged LTR and isolated per element, never left to the bidi algorithm.

## Layout

A jade shell spans the viewport; the content column caps at 1120px with a fluid gutter (`clamp(1rem, 4vw, 3rem)`). The header stacks brand plus segmented tabs, then one collapsible row of tag chips. On phones the expanded list takes the full row and caps at about four and a half rows, scrolling inside itself with a soft fade at its foot, so the table stays reachable. Below it the felt table takes the remaining height, its top corners rounded (16px) and its top edge shadowed inward where it meets the shell.

Spacing runs on a 4px step (4, 8, 12, 16, 24, 32, 48px). Tiles need room for their undersides: grid row gaps are larger than column gaps (32 by 24px desktop, 24 by 16px phone) so a lifted tile's jade stack never touches the row below.

- **Browse:** auto-fill grid of tiles at a 9rem minimum; exactly two columns at 640px and below.
- **Flashcards:** one centred 3:4 tile, 20rem wide (17rem on phones), toolbar above, three-button nav below (full width on phones).
- **Quiz:** prompt tile (16 to 22rem) beside a two-column grid of answer tiles; stacks to one column at 760px.
- **Touch:** every control is at least 44px tall; tag chips grow from 36 to 44px on phones.

## Elevation & Depth

Depth is a physical stack, not ambient blur. A tile is a bone face with a 3px inset bottom lip, then two solid offset layers of jade beneath it, then one soft cast shadow tinted Deepest Jade. A single variable (`--lift`, positive raised, negative pressed) drives both the tile's translate and the underside offsets, so the jade grows when a tile rises and shrinks when it is pressed. Wells (tab rail, search and answer inputs, empty state) are the inverse: inset shadows sunk into jade or felt.

### Shadow Vocabulary
- **Tile depth** (`inset 0 -3px 0 bone-shade, 0 calc(5px + lift) 0 jade-800, 0 calc(8px + lift) 0 jade-900, 0 calc(12px + lift*2) calc(16px + lift*2) rgba(7,42,34,.24)`): browse tiles and quiz answer tiles. Lift 6px on hover/focus (5px on answers), -3px on press.
- **Large tile** (`inset 0 -5px 0 bone-shade, 0 9px 0 jade-800, 0 13px 0 jade-900, 0 26px 36px rgba(7,42,34,.26–.30)`): quiz prompt and flashcard face. The flashcard back inverts it: a jade face with an inset jade-700 frame on bone-shade and bone-deep undersides.
- **Small tile** (`inset 0 -2px 0 bone-shade, 0 calc(3px + lift) 0 jade-800, 0 calc(5px + lift) 0 jade-900, 0 calc(8px + lift) 12px rgba(7,42,34,.2)`): bone buttons and breakdown mini-tiles. Lift 3px hover, -2px press.
- **Jade button** (`inset 0 -2px 0 jade-900`, then bone-shade and bone-deep undersides): the primary button, a jade tile resting on bone.
- **Raised dialog** (`inset 0 -5px 0 bone-shade, 0 10px 0 jade-700, 0 14px 0 jade-950, 0 32px 60px rgba(0,0,0,.35)`): the word dialog over a jade-tinted scrim (`rgba(7,42,34,.6)`).
- **Well** (`inset 0 2px 4px rgba(0,0,0,.3)` on jade; `inset 0 2px 4px rgba(7,42,34,.12)` on bone inputs): the tab rail and input fields.

### Named Rules
**The Underside Rule.** Tile thickness is drawn as stacked solid jade offsets under a bone face. That stack is the world's native material, not decoration: keep it on every tile, button-tile and dialog, and let `--lift` move it.

**The Spring Rule.** `--ease-spring` is reserved for tile physics: lift, press, flip and land (including the dialog and tooltip settling as tiles). Every other transition (colour, border, opacity, reveals, slides, the score pop) uses `--ease-out`.

## Shapes

Gently rounded, tile-like rectangles. Three radii only: 6px for small tiles (buttons, chips, mini-tiles, word tags, brand mark), 10px for word tiles, answer tiles, inputs, wells and the tooltip, 16px for large tiles (flashcard, prompt, dialog), the felt table's top corners and the empty well. Flashcards are a fixed 3:4 upright tile, like a real mahjong piece. Fully round shapes appear only for the dialog's close button and the selected-tag count badge. Icons are inline stroked SVG (round caps and joins, 1.8 to 2.5 stroke), never glyph characters.

## Components

### Word Tile (signature)
Bone face on tile depth, 10px radius, content stacked: Hanzi in its count-stepped band, tone contours, Pinyin (tone-inked per syllable), Hebrew gloss (Soft Ink, small). Hover or focus lifts it 6px and replays its contours; press sinks it 3px; focus adds a 3px Table Jade outline offset 4px. Opens the word dialog.

### Tone Contour (signature)
One short pitch line per syllable, drawn on a 32 by 20 box after Chao's tone letters: 1 high flat, 2 rising, 3 dipping, 4 falling, neutral a short dot in Muted Ink. Stroked 2.5px (3px large) with round caps, in the syllable's carving ink, always visible at rest. When playing, each path redraws by dash offset over `--tone-draw` (450ms), staggered by `--tone-stagger` (380ms) per syllable in reading order (LTR); `--tone-lead` delays the first stroke (320ms on the flashcard, so it starts after the flip lands). Reduced motion keeps the lines static. Contours are decorative (`aria-hidden`); Pinyin carries the text.

### Flashcard
A 3:4 tile that flips on Y (650ms, spring) from its jade back (a carved 回纹 meander band in Rim Jade inside the frame, an authored 16px SVG repeat, around a plain jade centre holding the Hanzi inlaid in bone with a muted hint) to its bone face with Hanzi, contours, Pinyin and Hebrew. Hover tilts it 5 degrees and lifts 6px. Cards slide out and in with a 3 degree rotation using ease-out.

### Quiz Answer Tile
Bone tile on tile depth, 10px radius, 5rem tall, 600 weight. On answer it holds its verdict: correct lands raised (3px) with a pale green fill, 2px carving-green edge and green underside plus a check; wrong stays pressed (-3px) with a pale red fill, red edge and underside, a cross and a short shake; the others fade to 50%. Hanzi options keep ink text through both verdicts. After answering, the prompt tile reveals the whole word (Hanzi, contours, Pinyin, Hebrew) under a bone-shade rule.

### Buttons
- **Shape:** small tile (6px), 44px tall, 600 weight, inline SVG icons.
- **Default:** bone face on small-tile depth.
- **Primary:** Table Jade face on a bone underside (one per view: flip, next, new quiz, check, clear search).
- **Hover / Press:** lift 3px / sink 2px on spring; press uses the fast duration (120ms).
- **Quiet:** no tile, Table Jade text, Deep Felt fill on hover (the shuffle action).

### Navigation
Segmented tabs sunk into a Jade Well rail (10px radius, 4px padding, inset shadow). Tabs are 44px tall, Pale Jade text, Rim Jade fill on hover; the active tab becomes a bone tile with ink text, a bone-shade lip and a jade-950 underside. On phones the rail spans the width and tabs share it equally. Focus outlines on the shell are bone.

### Chips
Tag filters on the jade shell: 1px Rim Jade outline, bone text, a muted count. Selected, a chip becomes a small bone tile (bone fill, ink, 600, 2px lip, jade-950 underside, raised 1px). Collapsed to one row; a quiet toggle with a rotating chevron expands them, showing a bone count badge when tags are selected while collapsed.

### Inputs / Fields
Wells: bone fill, 1px Deep Felt border, 10px radius, soft inset shadow, 48px tall (search, with a leading stroked magnifier) or 44 to 52px (selects, typed answer). Hover darkens the border to Old Bone; focus sets a Table Jade border plus a 3px Pale Jade halo. Selects keep native behaviour with a background chevron.

### Dialog and Tooltip
The word dialog is one large bone tile (16px radius, max 28rem) on the raised-dialog stack, rising and settling on spring over a jade scrim; inside, a round close button, word tags in Jade Wash, the headline Hanzi with large contours that write once on open, and breakdown / used-in rows of small bone mini-tiles. The character tooltip is a small bone tile with a jade notch, popping above the character with its own contours.

### Empty Well
A Well Felt well pressed into the table (16px radius, inset shadow, white lower highlight), Soft Ink text, the query in bold ink, and a primary jade button to clear the search.

## Do's and Don'ts

### Do:
- **Do** build every new interactive surface as a tile (bone face, jade underside, `--lift`), a well, or plain felt.
- **Do** draw tones only with the Tone Contour, in tone order 1 red, 2 green, 3 blue, 4 black, neutral as an ink-muted dot, replayed in reading order.
- **Do** keep Hanzi in ink on bone (bone on the jade back), and ink each Pinyin syllable in its tone colour at 600.
- **Do** carry quiz verdicts in fill, edge, underside, icon and the verdict line.
- **Do** step Hanzi size by character count so a word never wraps inside a tile.
- **Do** use `--ease-spring` only for lift, press, flip and land, `--ease-out` for everything else, and let reduced motion collapse animation (contours stay drawn, flips and slides go instant).
- **Do** keep 44px touch targets and visible focus (jade on felt, bone on the shell).

### Don't:
- **Don't** use a carving ink for anything but a tone (contour or Pinyin syllable) or a quiz verdict.
- **Don't** colour a Hanzi glyph with a carving ink, including on a verdict tile.
- **Don't** colour Pinyin jade, or ink a syllable in any colour but its own tone's.
- **Don't** flatten tiles into borderless white cards on grey with a single blue accent.
- **Don't** replace the solid jade underside with a blurred floating shadow.
- **Don't** add radii outside 6, 10 and 16px.

