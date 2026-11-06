---
version: 1
slug: "src-app-vue"
primary_target: "src/App.vue"
related_targets: ["src/components"]
---

# App shell and study views

Scope: the whole SPA (shell, Browse, Flashcards, Quiz, WordModal, HanziTooltip). Mode: Operate. Build path: code-led.

Audience and job: Hebrew speakers learning Chinese, on phone and desktop; find a word, review it, test recall. Constraints: RTL Hebrew UI, LTR-isolated Hanzi/Pinyin, AA contrast, 44px touch targets, reduced-motion respected. Nothing from the old look is kept except the name and the 汉 mark.

Chosen direction: Mahjong tiles, fused with the tone-lines direction at the user's request. Memorable moment: hovering (or flipping) a tile writes its tone contours one syllable after another, in reading order.

Unresolved: whether tag colour still appears on tiles (the sketch moved it to chips only); dark mode not planned.

## Direction contract

THESIS: Every word is a mahjong tile with real thickness: a carved bone face on a jade back, and under the Hanzi its tones are drawn as contour lines in the tile's own carving inks. It refuses the category default of flat white rounded cards on a grey ground with one blue accent.

OWN-WORLD: Jade-green shell (#0f4f40 family, darker well and lighter rim), a warm felt-table work area, bone tile faces with a visible jade underside that grows on lift and shrinks on press. Carving inks only: red, green, blue and black. They double as tone colours (1 red flat, 2 green rising, 3 blue dipping, 4 black falling). Serif Hanzi, humanist sans Hebrew. Tag chips are small bone tiles when selected.

STORY: The learner sees words as a table of tiles, scopes by tag, hovers to hear-by-eye the tones, flips a tile to recall, then quizzes. They believe the three scripts belong together and act by studying.

FIRST VIEWPORT: Jade header with brand mini-tile and standard segmented tabs (Browse / Flashcards / Quiz). A tag chip row below. The search field sits on the felt at the top of Browse, not in the header: it filters Browse only, and the header is shared by every mode (adaptation, recorded at the finish review). Then the felt area holding a grid of tiles (Hanzi at tile scale, tone contours, Pinyin, Hebrew). In Flashcards, one large tile flips from the jade back to the face, and its contours draw syllable by syllable.

FORM: Mahjong tiles (user-kept grounded direction from round 1, chosen over the bolder re-roll), with the raised line from Emission-line rail: tone shape and colour drawn per syllable, animated sequentially in reading order (staggered by syllable index, LTR). seed:01267209ff55e0a9

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

