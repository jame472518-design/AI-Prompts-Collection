# EP03: The Tiny Chef (小小廚師)
# Template: Little Chef | Character: Penguin | Total: 24 seconds (4 x 6s)

## Character Reference
- Chibi penguin, oversized head, tiny round body
- Enormous sparkly dark eyes with white belly patch
- Extremely puffy black and white plush feathers, tiny flippers
- Accessory: tiny chef hat and miniature apron
- Personality: determined, clumsy-adorable, food-loving

---

## Scene 1 — "The Finest Fish" (頂級食材)

**Starting Image Prompt (for text-to-image generation):**
`An adorable chibi penguin with oversized head, enormous sparkly dark eyes, white belly patch, extremely puffy black and white plush feathers, tiny flippers, wearing a tiny white chef hat and miniature apron, standing proudly on a wooden step stool at a pastel kitchen counter, inspecting a huge golden fish twice its size on a cutting board, expression of serious professional concentration, warm kitchen lighting with hanging copper pots in background, 3D cartoon Pixar style, chibi proportions, kawaii aesthetic, soft pastel kitchen tones, 8k render`

**I2V Motion Prompt (v2 - simplified, 2-3 actions max):**
`The chibi penguin in chef hat leans forward and sniffs the oversized fish on the counter, its tiny body wobbling on the step stool. It pulls back, closes its eyes, and gives a slow confident nod of approval. Camera holds steady medium shot at counter level. Warm cozy kitchen lighting, gentle steam wisps rising.`

**Transition Anchor (結尾錨點):** Penguin standing at counter beside the fish, facing forward with a determined look. Counter-level medium shot.

**Music Prompt:**
`cheerful French bistro accordion melody, light bouncy pizzicato strings, warm kitchen ambiance, whimsical cooking show opening, 110 bpm, no vocals, instrumental, charming patisserie soundtrack`

**Narration Script (旁白腳本):**
`小企鵝廚師今天要挑戰大料理！牠仔細聞了聞這條大魚……嗯，非常滿意！`
- Duration: 5s | Tone: cheerful, proud narrator introducing a cooking show

**中文說明：** Q版企鵝戴著小廚師帽站在墊腳凳上，認真地檢查台面上一條比牠還大的魚。牠湊近聞了聞，然後滿意地點頭。鏡頭維持台面高度的中景穩定拍攝。

---

## Scene 2 — "Batter Disaster" (麵糊大災難)

**Starting Image:** Use last frame of Scene 1

**I2V Motion Prompt (v2 - simplified, 2-3 actions max):**
`The chibi penguin at the counter grips a large wooden spoon with both tiny flippers and vigorously stirs a big mixing bowl, its whole round body spinning with the effort. Batter splatters outward onto its face and chef hat, and a soft puff of flour cloud rises around it. Camera holds steady medium shot at counter level. Warm kitchen lighting, flour particles floating in air.`

**Transition Anchor (結尾錨點):** Penguin standing at counter covered in batter and flour, blinking through the mess. Counter-level medium shot.

**Music Prompt:**
`fast tempo playful xylophone and snare drum rhythm, comedic escalating tempo as stirring speeds up, splashy sound accents, cartoon slapstick cooking chaos, 130 bpm, no vocals, instrumental, whimsical kitchen comedy score`

**Narration Script (旁白腳本):**
`攪啊攪啊——哎呀！麵糊噴得到處都是啦！連臉上都是！`
- Duration: 5s | Tone: excited, building to comedic surprise, giggling narrator

**中文說明：** 企鵝在台面前（承接 Scene 1）用兩隻小翅膀抓著大木勺拼命攪拌，整個圓身體跟著轉。麵糊飛濺到臉上和廚師帽上，一陣麵粉雲騰起。鏡頭維持台面中景。

---

## Scene 3 — "The First Bite" (第一口的感動)

**Starting Image:** Use last frame of Scene 2

**I2V Motion Prompt (v2 - simplified, 2-3 actions max):**
`The batter-covered chibi penguin nervously pushes a tiny plate with a golden fish cake forward on the counter, flippers trembling slightly. It takes a small bite, then its enormous dark eyes transform into sparkling star-shaped eyes bursting with pure joy, its whole body wiggling with happiness. Camera slowly zooms in from medium shot to close-up on the sparkly star eyes. Warm golden glow radiating outward.`

**Transition Anchor (結尾錨點):** Penguin with sparkly star eyes, mouth open in delight, tiny plate in front. Close-up shot.

**Music Prompt:**
`gentle nervous violin tremolo building to a magical sparkling chime burst, heartwarming emotional swell with glockenspiel and harp, wonder and delight, 95 bpm rising to 115 bpm, no vocals, instrumental, magical food revelation moment`

**Narration Script (旁白腳本):**
`小廚師緊張地嚐了一口……哇！眼睛都亮起來了！這是全世界最好吃的料理！`
- Duration: 5s | Tone: nervous whisper building to pure joyful amazement

**中文說明：** 滿身麵糊的企鵝（承接 Scene 2）緊張地端出一個小盤子，上面是金黃色的魚餅。牠小心翼翼咬了一口，然後眼睛變成閃亮星星眼，整個身體開心地扭動。鏡頭從中景慢慢推到星星眼特寫。

---

## Scene 4 — "Chef's Kiss" (廚師之吻)

**Starting Image:** Use last frame of Scene 3

**I2V Motion Prompt (v2 - simplified, 2-3 actions max):**
`The chibi penguin with sparkly eyes raises one tiny flipper to its beak and performs an exaggerated chef's kiss gesture, eyes closed with pure satisfaction. It steps back on the stool to proudly admire its golden fish cake masterpiece as colorful confetti and tiny golden stars rain down from above. Camera pulls back to a wide celebratory shot. Festive warm lighting with sparkle particles everywhere.`

**Transition Anchor (結尾錨點):** Penguin posing proudly with confetti and stars raining down. Wide celebratory shot.

**Music Prompt:**
`triumphant celebratory fanfare with brass and strings, confetti pop sound effects, joyful French accordion finale, magical sparkling chimes raining down, grand cooking show victory theme, 120 bpm, no vocals, instrumental, award-winning chef celebration`

**Narration Script (旁白腳本):**
`啾——完美！小企鵝廚師的第一道料理，大！成！功！`
- Duration: 4s | Tone: dramatic chef's kiss, triumphant celebration, proud finale

**中文說明：** 企鵝（承接 Scene 3 星星眼）舉起小翅膀做出誇張的廚師之吻手勢，閉眼陶醉。然後後退一步，驕傲地欣賞自己的傑作，五彩紙屑和金色星星從天而降。鏡頭拉遠到慶祝全景。

---

## Post-Production

### Concatenation (with crossfade transitions):
```bash
node scripts/concat_video.js --input ./episodes/EP03_clips/ --output ./output/EP03_penguin_little_chef.mp4 --music ./music/EP03_bgm.mp3 --crossfade 0.3 --title "The Tiny Chef"
```

### Scene Chaining:
```bash
# After generating Scene 1 video, extract last frame for Scene 2 input:
node scripts/concat_video.js --extract ./episodes/EP03_clips/scene_01.mp4 --frame ./episodes/EP03_clips/scene_02_input.png
# Repeat for each subsequent scene
```

### Upload Checklist:
- [ ] Title: "The Tiny Chef 🐧 #shorts #cute #penguin #cooking"
- [ ] Description: "When a tiny penguin chef makes its first masterpiece... 🍳✨"
- [ ] Tags: cute animal, chibi, 3D animation, penguin, cooking, kawaii, shorts, chef
- [ ] Thumbnail: Use Scene 3 "sparkly star eyes first bite" as thumbnail
- [ ] Schedule: Post during peak hours (6-9 PM local time of target audience)
