# EP01: The Cookie Heist (餅乾大盜)
# Template: Daily Disaster | Character: Raccoon | Total: 24 seconds (4 x 6s)

## Character Reference
- Chibi raccoon, oversized head, tiny body
- Enormous sparkly eyes with natural dark mask markings
- Extremely puffy grey plush fur, fluffy striped tail
- Accessory: tiny detective hat
- Personality: mischievous, guilty-cute, treasure-loving

---

## Scene 1 — "Target Acquired" (目標鎖定)

**Starting Image Prompt (for text-to-image generation):**
`An adorable chibi raccoon with oversized head, enormous sparkly eyes with dark mask markings, extremely puffy grey plush fur, wearing a tiny detective hat, peeking around a kitchen doorframe at night, one chubby paw gripping the doorframe, eyes locked on something off-screen with intense focus, moonlight casting dramatic shadows, 3D cartoon Pixar style, chibi proportions, kawaii aesthetic, pastel kitchen background, dramatic noir lighting, 8k render`

**I2V Motion Prompt (v2 - simplified, 2-3 actions max):**
`The chibi raccoon slowly peeks its oversized head around the kitchen doorframe, enormous eyes scanning left and right with exaggerated caution. It spots the cookie jar on the counter and its pupils dilate wide with excited desire. Camera holds steady low-angle shot. Moonlit kitchen, dramatic noir shadows, dust particles in moonbeams.`

**Transition Anchor (結尾錨點):** Raccoon has entered the kitchen, facing toward the counter. Low-angle camera.

**Music Prompt:**
`sneaky spy pizzicato strings, tiptoeing staccato bass, building tension, mysterious and playful, cartoon heist movie opening, 100 bpm, no vocals, instrumental, cinematic spy comedy`

**Narration Script (旁白腳本):**
`深夜的廚房裡，一隻小浣熊悄悄探出了頭……牠的目標只有一個——那罐餅乾。`
- Duration: 5s | Tone: mysterious, whispering storyteller

**中文說明：** Q版浣熊從廚房門框後慢慢探出大頭，大眼睛誇張地左右掃視。發現台面上的餅乾罐，瞳孔因興奮而放大。鏡頭維持低角度穩定拍攝。

---

## Scene 2 — "The Climb" (攀爬行動)

**Starting Image:** Use last frame of Scene 1

**I2V Motion Prompt (v2 - simplified, 3 actions max):**
`The chibi raccoon stands at the base of the kitchen counter, looking up at the towering cookie jar above. It puffs out its chubby cheeks with determination and begins climbing up using drawer handles, fluffy striped tail wobbling for balance. One paw slips briefly before grabbing back on. Camera tilts upward following the climb. Moonlit kitchen, tense atmosphere.`

**Transition Anchor (結尾錨點):** Raccoon has reached the counter top, near the cookie jar. Counter-level camera.

**Music Prompt:**
`tension building orchestral strings, climbing ascending melody, moment of danger with brief comedic trombone when slipping, mission impossible parody, 110 bpm, no vocals, cartoon action score`

**Narration Script (旁白腳本):**
`小浣熊深吸一口氣，開始了牠的攀爬大作戰……差一點！差一點就掉下去了！`
- Duration: 5s | Tone: tense, excited commentator

**中文說明：** 浣熊站在廚房台面下方（承接 Scene 1），仰頭看高處的餅乾罐。鼓起胖臉頰開始攀爬，尾巴搖搖晃晃保持平衡。一隻爪差點滑掉又重新抓住。鏡頭跟隨向上。

---

## Scene 3 — "Caught Red-Pawed" (現行犯)

**Starting Image:** Use last frame of Scene 2

**I2V Motion Prompt (v2 - simplified, 3 actions max):**
`The chibi raccoon on the counter grabs the biggest cookie with both chubby paws and takes an enormous bite, cheeks puffing out comically full. Suddenly the kitchen light switches on. The raccoon freezes mid-chew, enormous guilty eyes slowly turning toward the light source. Camera holds medium shot then zooms to the frozen guilty face. Dramatic spotlight replacing moonlight.`

**Transition Anchor (結尾錨點):** Raccoon frozen on counter, cookie in mouth, staring at light source. Counter-level medium shot.

**Music Prompt:**
`triumphant brief fanfare for cookie grab, happy munching sounds, then sudden dramatic record scratch silence when light turns on, comedic frozen moment, 105 bpm dropping to 0, no vocals, spy caught red-handed score`

**Narration Script (旁白腳本):**
`終於拿到了！好好吃……等等，燈怎麼亮了？！`
- Duration: 4s | Tone: joyful then sudden shock, dramatic pause

**中文說明：** 浣熊在台面上（承接 Scene 2）抓起餅乾大咬一口，臉頰鼓得圓圓的。突然廚房燈亮了，浣熊嚼到一半完全定格，心虛的大眼睛慢慢轉向光源。

---

## Scene 4 — "The Getaway" (可愛逃脫)

**Starting Image:** Use last frame of Scene 3

**I2V Motion Prompt (v2 - simplified, 3 actions max):**
`The frozen chibi raccoon on the counter suddenly bolts into a panicked waddle-run, clutching the cookie to its chest. It reaches the counter edge and jumps off into darkness below. Final moment: it peeks back up from below the edge, just its eyes and detective hat visible, giving a satisfied wink. Camera tracks the run then holds on the peek-back moment. Warm cozy lighting at the end.`

**Music Prompt:**
`sudden frantic cartoon chase music, rapid pizzicato and xylophone, comical running percussion, then warm gentle resolution melody as raccoon peeks back, satisfied mischievous ending with soft chime, 140 bpm dropping to 85 bpm, no vocals, cartoon heist escape to cozy ending`

**Narration Script (旁白腳本):**
`跑啊跑啊——嘿嘿，餅乾到手，任務完成！晚安～`
- Duration: 4s | Tone: panicked rush then satisfied, cozy whisper at end

**中文說明：** 定格中的浣熊（承接 Scene 3）突然慌張地抱著餅乾狂奔，跑到台面邊緣跳下去。最後從下方探出頭，只露出眼睛和偵探帽，滿足地眨眼。

---

## Post-Production

### Concatenation (with crossfade transitions):
```bash
node scripts/concat_video.js --input ./episodes/EP01_clips/ --output ./output/EP01_cookie_heist.mp4 --music ./music/EP01_bgm.mp3 --crossfade 0.3 --title "The Cookie Heist"
```

### Scene Chaining:
```bash
# After generating Scene 1 video, extract last frame for Scene 2 input:
node scripts/concat_video.js --extract ./episodes/EP01_clips/scene_01.mp4 --frame ./episodes/EP01_clips/scene_02_input.png
# Repeat for each subsequent scene
```

### Upload Checklist:
- [ ] Title: "The Cookie Heist 🍪 #shorts #cute #raccoon"
- [ ] Description: "When a tiny raccoon can't resist the cookie jar... 🦝✨"
- [ ] Tags: cute animal, chibi, 3D animation, raccoon, funny, kawaii, shorts
- [ ] Thumbnail: Use Scene 3 "frozen guilty face" as thumbnail
- [ ] Schedule: Post during peak hours (6-9 PM local time of target audience)
