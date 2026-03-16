# 療癒動物漫劇 — 角色設定表

> **用途：** 使用 ComfyUI 文生圖（Flux / SDXL）生成主角「小橘」的參考圖，確保後續所有場景圖與 LTX 2.3 + Qwen 3.5 LLM 影片生成時，角色外觀保持一致。

---

## 主角：小橘（Xiao Ju）

一隻流浪小橘貓，是整部連續劇的核心角色。

### 外觀設定（固定不變）

| 項目 | 描述 |
|------|------|
| **風格** | 3D Pixar/Disney 風格，chibi 比例（頭大身體小） |
| **毛色** | 溫暖的橘色，帶淡淡的虎斑紋路 |
| **眼睛** | 超大圓形琥珀色眼睛，帶明顯的光澤反射點 |
| **鼻子** | 小小的粉紅色三角形鼻子 |
| **體型** | 圓滾滾的，毛髮蓬鬆柔軟 |
| **特徵** | 左耳有一個小缺口（流浪的痕跡）、尾巴末端顏色稍深 |
| **表情範圍** | 害怕、好奇、猶豫、感動、安心、幸福 |

### 流浪狀態 vs 回家狀態

| 狀態 | 毛髮 | 眼睛 | 身體語言 |
|------|------|------|----------|
| **流浪版**（EP01-EP02） | 稍微凌亂 | 眼角帶一點淚光 | 身體微微縮著 |
| **回家版**（EP03-EP04） | 整齊蓬鬆 | 明亮閃爍 | 放鬆舒展 |

### 角色描述統一段落（Prompt 核心片段）

> 以下段落在所有 prompt 中必須**完全一致地複製貼上**，不可更改任何字詞，以確保角色一致性。

**流浪版核心段落（英文）：**
```
a cute chibi orange tabby kitten, 3D Pixar Disney style, big head small body proportions, warm orange fur with subtle tabby stripes, oversized round amber eyes with prominent specular highlights, tiny pink triangular nose, round chubby fluffy body, small notch on left ear, darker fur at tail tip, slightly messy and disheveled fur, faint tear shimmer in eyes, body slightly hunched and tense
```

**流浪版核心段落（中文 — 給 Qwen / LTX 2.3 使用）：**
```
一隻可愛的Q版小橘貓，3D Pixar迪士尼風格，頭大身體小的Q版比例，溫暖的橘色毛髮帶淡淡虎斑紋路，超大圓形琥珀色眼睛帶明顯光澤反射點，小小的粉紅色三角形鼻子，圓滾滾蓬鬆柔軟的身體，左耳有一個小缺口，尾巴末端顏色較深。流浪狀態：毛髮稍微凌亂，眼角帶一絲淚光，身體微微縮著顯得緊張
```

**回家版核心段落（英文）：**
```
a cute chibi orange tabby kitten, 3D Pixar Disney style, big head small body proportions, warm orange fur with subtle tabby stripes, oversized round amber eyes with prominent specular highlights, tiny pink triangular nose, round chubby fluffy body, small notch on left ear, darker fur at tail tip, clean fluffy well-groomed fur, bright sparkling eyes, relaxed and comfortable posture
```

**回家版核心段落（中文 — 給 Qwen / LTX 2.3 使用）：**
```
一隻可愛的Q版小橘貓，3D Pixar迪士尼風格，頭大身體小的Q版比例，溫暖的橘色毛髮帶淡淡虎斑紋路，超大圓形琥珀色眼睛帶明顯光澤反射點，小小的粉紅色三角形鼻子，圓滾滾蓬鬆柔軟的身體，左耳有一個小缺口，尾巴末端顏色較深。回家狀態：毛髮整齊蓬鬆，眼睛明亮閃爍，身體放鬆舒展
```

---

## 參考圖生成清單

---

### 圖 1 — 角色正面全身圖（流浪版）

**用途：** EP01-EP02 的基礎角色形象，作為後續所有流浪狀態場景的角色參考。

**Prompt:**
```
a cute chibi orange tabby kitten, 3D Pixar Disney style, big head small body proportions, warm orange fur with subtle tabby stripes, oversized round amber eyes with prominent specular highlights, tiny pink triangular nose, round chubby fluffy body, small notch on left ear, darker fur at tail tip, slightly messy and disheveled fur, faint tear shimmer in eyes, body slightly hunched and tense, front-facing full body view, standing pose, timid yet determined expression, plain white background, character reference sheet style, soft studio lighting, high detail, sharp focus, 8k
```

**中文 Prompt（給 Qwen / LTX 2.3）：**
```
一隻可愛的Q版小橘貓，3D Pixar迪士尼風格，頭大身體小的Q版比例，溫暖的橘色毛髮帶淡淡虎斑紋路，超大圓形琥珀色眼睛帶明顯光澤反射點，小小的粉紅色三角形鼻子，圓滾滾蓬鬆柔軟的身體，左耳有一個小缺口，尾巴末端顏色較深。流浪狀態：毛髮稍微凌亂，眼角帶一絲淚光，身體微微縮著。正面站立全身圖，有些膽怯但倔強的表情，白色背景，角色設定表風格，柔和攝影棚燈光，高細節，8k畫質
```

**Negative Prompt:**
```
human, person, text, watermark, logo, signature, blurry, low quality, deformed, extra limbs, extra tails, extra ears, mutated, disfigured, bad anatomy, ugly, cropped, out of frame, worst quality, low resolution, duplicate, multiple cats, realistic photo style, dark background
```

**建議設定：**
- 解析度：1024 x 1024
- Steps：30-40
- CFG：7.0-7.5
- Sampler：DPM++ 2M Karras
- Seed：＿＿＿＿＿＿（首次生成滿意後記錄在此）

---

### 圖 2 — 角色正面全身圖（回家版）

**用途：** EP03-EP04 的基礎角色形象，作為後續所有回家狀態場景的角色參考。

**Prompt:**
```
a cute chibi orange tabby kitten, 3D Pixar Disney style, big head small body proportions, warm orange fur with subtle tabby stripes, oversized round amber eyes with prominent specular highlights, tiny pink triangular nose, round chubby fluffy body, small notch on left ear, darker fur at tail tip, clean fluffy well-groomed fur, bright sparkling eyes, relaxed and comfortable posture, front-facing full body view, standing pose, gentle happy smile, plain white background, character reference sheet style, soft studio lighting, high detail, sharp focus, 8k
```

**中文 Prompt（給 Qwen / LTX 2.3）：**
```
一隻可愛的Q版小橘貓，3D Pixar迪士尼風格，頭大身體小的Q版比例，溫暖的橘色毛髮帶淡淡虎斑紋路，超大圓形琥珀色眼睛帶明顯光澤反射點，小小的粉紅色三角形鼻子，圓滾滾蓬鬆柔軟的身體，左耳有一個小缺口，尾巴末端顏色較深。回家狀態：毛髮整齊蓬鬆，眼睛明亮閃爍。正面站立全身圖，溫柔幸福的微笑，白色背景，角色設定表風格，柔和攝影棚燈光，高細節，8k畫質
```

**Negative Prompt:**
```
human, person, text, watermark, logo, signature, blurry, low quality, deformed, extra limbs, extra tails, extra ears, mutated, disfigured, bad anatomy, ugly, cropped, out of frame, worst quality, low resolution, duplicate, multiple cats, realistic photo style, dark background, dirty fur, messy fur
```

**建議設定：**
- 解析度：1024 x 1024
- Steps：30-40
- CFG：7.0-7.5
- Sampler：DPM++ 2M Karras
- Seed：＿＿＿＿＿＿（首次生成滿意後記錄在此）

---

### 圖 3 — 表情集（Emotion Sheet）

**用途：** 確保各種情緒下角色臉部一致，作為後續表情演出的參考依據。

**Prompt:**
```
emotion expression sheet of a cute chibi orange tabby kitten, 3D Pixar Disney style, big head small body proportions, warm orange fur with subtle tabby stripes, oversized round amber eyes with prominent specular highlights, tiny pink triangular nose, small notch on left ear, six head close-up expressions in a grid layout: scared fearful, curious wide-eyed, hesitant uncertain, touched with tears of joy, calm relieved, blissful happy, each expression clearly different and labeled, plain white background, character design sheet, soft studio lighting, high detail, sharp focus, 8k
```

**中文 Prompt（給 Qwen / LTX 2.3）：**
```
表情集：一隻可愛的Q版小橘貓，3D Pixar迪士尼風格，頭大身體小的Q版比例，溫暖的橘色毛髮帶淡淡虎斑紋路，超大圓形琥珀色眼睛帶明顯光澤反射點，小小的粉紅色三角形鼻子，左耳有一個小缺口。六格頭部特寫表情排列：害怕恐懼、好奇睜大眼、猶豫不確定、感動含淚、安心放鬆、幸福快樂。每個表情明顯不同，白色背景，角色設計表風格，柔和攝影棚燈光，高細節，8k畫質
```

**Negative Prompt:**
```
human, person, text, watermark, logo, signature, blurry, low quality, deformed, extra limbs, extra ears, mutated, disfigured, bad anatomy, ugly, cropped, out of frame, worst quality, low resolution, full body, realistic photo style, dark background, overlapping faces, merged expressions
```

**建議設定：**
- 解析度：1536 x 1024（橫向，方便排列六格）
- Steps：35-45
- CFG：7.0-7.5
- Sampler：DPM++ 2M Karras
- Seed：＿＿＿＿＿＿（首次生成滿意後記錄在此）

---

### 圖 4 — 角色三視圖（Turnaround Sheet）

**用途：** 提供不同角度的一致性參考，確保側面與背面鏡頭的角色正確。

**Prompt:**
```
character turnaround reference sheet of a cute chibi orange tabby kitten, 3D Pixar Disney style, big head small body proportions, warm orange fur with subtle tabby stripes, oversized round amber eyes with prominent specular highlights, tiny pink triangular nose, round chubby fluffy body, small notch on left ear, darker fur at tail tip, clean fluffy fur, three views side by side: front view, side profile view, back view, T-pose standing, plain white background, character model sheet, even studio lighting, high detail, sharp focus, 8k
```

**中文 Prompt（給 Qwen / LTX 2.3）：**
```
角色三視圖：一隻可愛的Q版小橘貓，3D Pixar迪士尼風格，頭大身體小的Q版比例，溫暖的橘色毛髮帶淡淡虎斑紋路，超大圓形琥珀色眼睛帶明顯光澤反射點，小小的粉紅色三角形鼻子，圓滾滾蓬鬆柔軟的身體，左耳有一個小缺口，尾巴末端顏色較深，毛髮整齊蓬鬆。三個視角並排：正面、側面、背面，T字站姿，白色背景，角色模型設定表，均勻攝影棚燈光，高細節，8k畫質
```

**Negative Prompt:**
```
human, person, text, watermark, logo, signature, blurry, low quality, deformed, extra limbs, extra tails, extra ears, mutated, disfigured, bad anatomy, ugly, cropped, out of frame, worst quality, low resolution, realistic photo style, dark background, action pose, sitting, overlapping views
```

**建議設定：**
- 解析度：1536 x 1024（橫向，方便排列三視圖）
- Steps：35-45
- CFG：7.0-7.5
- Sampler：DPM++ 2M Karras
- Seed：＿＿＿＿＿＿（首次生成滿意後記錄在此）

---

### 圖 5 — 場景測試圖（雨夜版）

**用途：** 確認角色在暗色場景中的視覺效果，測試角色與環境的融合度（對應 EP01 開場）。

**Prompt:**
```
a cute chibi orange tabby kitten, 3D Pixar Disney style, big head small body proportions, warm orange fur with subtle tabby stripes, oversized round amber eyes with prominent specular highlights, tiny pink triangular nose, round chubby fluffy body, small notch on left ear, darker fur at tail tip, slightly messy and disheveled fur, faint tear shimmer in eyes, body slightly hunched and tense, curled up hiding under a cardboard box, rainy night city alley scene, wet pavement reflections, dark blue and purple color palette, dim warm streetlight glow illuminating the kitten, rain droplets visible, moody cinematic atmosphere, volumetric lighting, depth of field, high detail, 8k
```

**中文 Prompt（給 Qwen / LTX 2.3）：**
```
一隻可愛的Q版小橘貓，3D Pixar迪士尼風格，頭大身體小的Q版比例，溫暖的橘色毛髮帶淡淡虎斑紋路，超大圓形琥珀色眼睛帶明顯光澤反射點，小小的粉紅色三角形鼻子，圓滾滾蓬鬆柔軟的身體，左耳有一個小缺口，尾巴末端顏色較深。流浪狀態：毛髮稍微凌亂，眼角帶淚光，身體微縮。蜷縮在紙箱下方避雨，雨夜城市巷弄場景，潮溼柏油路面反射光線，暗藍紫色調，昏暗溫暖的路燈照亮小橘貓，雨滴清晰可見，電影級氛圍感，體積光，景深效果，高細節，8k畫質
```

**Negative Prompt:**
```
human, person, text, watermark, logo, signature, blurry, low quality, deformed, extra limbs, extra tails, extra ears, mutated, disfigured, bad anatomy, ugly, cropped, out of frame, worst quality, low resolution, bright daylight, sunny, cheerful colors, multiple cats, realistic photo style
```

**建議設定：**
- 解析度：1024 x 1024（或 1216 x 832 電影比例）
- Steps：35-45
- CFG：7.0-8.0
- Sampler：DPM++ 2M Karras
- Seed：＿＿＿＿＿＿（首次生成滿意後記錄在此）

---

### 圖 6 — 場景測試圖（溫暖室內版）

**用途：** 確認角色在明亮暖色場景中的視覺效果，測試角色與環境的融合度（對應 EP03-EP04）。

**Prompt:**
```
a cute chibi orange tabby kitten, 3D Pixar Disney style, big head small body proportions, warm orange fur with subtle tabby stripes, oversized round amber eyes with prominent specular highlights, tiny pink triangular nose, round chubby fluffy body, small notch on left ear, darker fur at tail tip, clean fluffy well-groomed fur, bright sparkling eyes, relaxed and comfortable posture, sitting on a soft fluffy blanket, warm cozy indoor room, golden sunlight streaming through window, warm golden color palette, gentle lens flare, bokeh background, soft shadows, peaceful serene atmosphere, cinematic lighting, high detail, 8k
```

**中文 Prompt（給 Qwen / LTX 2.3）：**
```
一隻可愛的Q版小橘貓，3D Pixar迪士尼風格，頭大身體小的Q版比例，溫暖的橘色毛髮帶淡淡虎斑紋路，超大圓形琥珀色眼睛帶明顯光澤反射點，小小的粉紅色三角形鼻子，圓滾滾蓬鬆柔軟的身體，左耳有一個小缺口，尾巴末端顏色較深。回家狀態：毛髮整齊蓬鬆，眼睛明亮閃爍，身體放鬆舒適。坐在柔軟蓬鬆的毯子上，溫暖舒適的室內房間，金色陽光從窗戶灑進來，暖金色調，柔和鏡頭光暈，背景散景，柔和陰影，寧靜祥和的氛圍，電影級燈光，高細節，8k畫質
```

**Negative Prompt:**
```
human, person, text, watermark, logo, signature, blurry, low quality, deformed, extra limbs, extra tails, extra ears, mutated, disfigured, bad anatomy, ugly, cropped, out of frame, worst quality, low resolution, dark scene, night, rain, cold colors, multiple cats, realistic photo style, dirty fur, messy fur
```

**建議設定：**
- 解析度：1024 x 1024（或 1216 x 832 電影比例）
- Steps：35-45
- CFG：7.0-8.0
- Sampler：DPM++ 2M Karras
- Seed：＿＿＿＿＿＿（首次生成滿意後記錄在此）

---

## 角色一致性技巧

### 1. 固定 Seed 策略

找到滿意的角色外觀後，**立刻記錄該 seed 值**。後續所有圖片生成都使用同一個 seed 作為起點。

**操作步驟：**
1. 先用圖 1 的 prompt 生成 4-8 張圖（隨機 seed）
2. 挑選角色外觀最接近設定的那一張
3. 記下該張圖的 seed 值，填入上方「Seed」欄位
4. 後續圖 2-6 都以這個 seed 為基礎生成
5. 如果換場景後角色偏差太大，可以微調 seed（+1, +2 嘗試）

> **注意：** 不同 prompt 內容即使用同一個 seed，結果仍會有差異。Seed 策略是輔助手段，不是萬能解法，需搭配下方其他技巧一起使用。

### 2. Prompt 角色描述段落完全一致

這是**最重要的一致性技巧**。

**規則：**
- 本文件上方已定義「流浪版核心段落」與「回家版核心段落」
- 在所有 prompt 中，角色描述的部分必須**逐字複製貼上**，不可修改任何用詞
- 只在角色描述段落的**前面或後面**添加場景、構圖、燈光等描述
- 不要用同義詞替換（例如不要把 `amber eyes` 改成 `golden eyes`）
- 不要調整詞語順序

**Prompt 結構建議：**
```
[角色核心段落（固定不變）], [動作/姿勢], [場景描述], [燈光/色調], [品質詞]
```

### 3. IP-Adapter 參考圖輸入（推薦）

如果你的 ComfyUI 已安裝 IP-Adapter 節點，這是目前**最有效的角色一致性方法**。

**操作步驟：**
1. 用圖 1（正面全身圖）作為 IP-Adapter 的參考圖
2. 設定 IP-Adapter 權重為 `0.6 - 0.8`（太高會限制場景變化，太低則角色不像）
3. 後續每張場景圖都掛載同一張參考圖
4. 可同時使用文字 prompt 控制場景與動作

**推薦的 IP-Adapter 模型：**
- `ip-adapter-plus_sd15.safetensors`（SD 1.5 用）
- `ip-adapter-plus_sdxl_vit-h.safetensors`（SDXL 用）
- `ip-adapter-plus-face_sdxl_vit-h.safetensors`（臉部強化版，SDXL 用）

**ComfyUI 工作流建議：**
```
Load Image (參考圖) → IP-Adapter → KSampler
                         ↑
              Text Prompt (場景描述) → CLIP Encode
```

### 4. LoRA 訓練選項（進階）

如果以上方法仍無法達到足夠的一致性，可以考慮為小橘訓練一個專屬 LoRA。

**前置條件：**
- 需要 15-30 張小橘的高品質圖片（從圖 1-4 生成的結果中挑選）
- 需要有足夠的 GPU 顯存（建議 12GB 以上）

**訓練工具推薦：**
- **Kohya_ss**：最成熟的 LoRA 訓練工具，支援 SDXL
- **ai-toolkit**（Ostris）：較新，流程簡化

**訓練參數建議：**
| 參數 | 建議值 |
|------|--------|
| 訓練圖片數 | 15-30 張 |
| 觸發詞（Trigger Word） | `xj_cat` 或 `xiaoju_cat` |
| 訓練步數 | 1500-3000 steps |
| 學習率 | 1e-4 |
| 網路維度（Network Dim） | 32-64 |
| 網路 Alpha | 16-32 |
| 批次大小 | 1-2 |

**使用方式：**
- 訓練完成後，在 prompt 開頭加上觸發詞 `xj_cat`
- LoRA 權重建議 `0.7 - 0.9`
- 搭配 IP-Adapter 使用效果更佳

---

## 工作流程總結

```
步驟 1：用圖 1 prompt 生成多張 → 挑選最佳 → 記錄 seed
步驟 2：用同 seed 生成圖 2-4 → 確認角色一致
步驟 3：生成圖 5-6 場景測試 → 確認場景融合效果
步驟 4：（可選）用滿意的圖片訓練 LoRA
步驟 5：正式生成各集場景圖 → 搭配 IP-Adapter + 固定 prompt
步驟 6：將場景圖送入 LTX 2.3 + Qwen 3.5 生成影片
```
