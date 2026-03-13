# AI 漫劇完整製作流程指南

> **硬體環境**：RTX 5070 Ti (16GB VRAM) / 64GB RAM
> **核心工具**：ComfyUI + SVI Pro Workflow (Wan 2.2 I2V 14B) / MMAudio / ACE-Step / Qwen3-TTS 1.7B / FFmpeg / Node.js concat_video.js

---

## Part 1: AI 漫劇概念

### 什麼是 AI 漫劇（Motion Comic）

AI 漫劇是一種介於「靜態漫畫」和「全動態動畫」之間的影像形式。它以高品質的 AI 繪圖為基底，搭配局部微動態（眨眼、風吹、光影流動）、鏡頭推拉（Ken Burns Effect）、旁白、音效與配樂，組合成一段有敘事節奏的影片。

核心特色：
- **靜中有動**：每個場景以一張精緻插畫為主體，只加入微量動態，保留「畫面感」
- **敘事驅動**：靠旁白與文字推動劇情，而非動作流暢度
- **氛圍優先**：音樂、音效、節奏的搭配比動畫幀數更重要

### 與傳統動畫 / Shorts 的區別

| 比較項目 | 傳統動畫 | YouTube Shorts | AI 漫劇 |
|---------|---------|---------------|--------|
| 每秒畫面 | 12-24 fps 全動態 | 剪輯拼接實拍/動畫 | 1 張靜態圖 + 微動態 |
| 製作成本 | 極高 | 中等 | 低（單人可完成） |
| 單集長度 | 5-30 分鐘 | 15-60 秒 | 3-10 分鐘 |
| 觀看體驗 | 動態沉浸 | 快節奏刺激 | 慢節奏沉浸、閱讀感 |
| GPU 需求 | 渲染農場 | 不一定需要 | 文生圖 + 短 I2V |

### 為什麼適合療癒內容

1. **慢節奏天然契合**：療癒內容不需要快節奏剪輯，漫劇的「一張圖停留 5-10 秒」反而營造沉靜氛圍
2. **畫風一致性高**：AI 文生圖在固定風格（如 chibi、水彩風、吉卜力風）下能產出高度一致的畫面
3. **聲音是關鍵**：療癒內容的核心是「聲音」——輕柔旁白、自然音效、溫暖 BGM，漫劇格式讓聲音成為主角
4. **製作效率高**：一集 5 分鐘的漫劇只需 8-16 張圖，單人一天內可完成

---

## Part 2: 製作流程總覽

### 完整 Pipeline

```
劇本 → 文生圖(8-16張) → 局部動態(I2V 2-3秒) → Ken Burns鏡頭效果 → 旁白(TTS) → 音效(MMAudio) → BGM/原創歌曲 → 字幕 → FFmpeg合併 → 輸出
```

### 各階段時間估算（單集 5 分鐘漫劇，12 個場景）

| 階段 | 工具 | 預估時間 | GPU/CPU |
|-----|------|---------|---------|
| 劇本撰寫 | Claude / 手寫 | 30-60 分鐘 | - |
| 文生圖 x12 | ComfyUI (SDXL/Flux) | 20-40 分鐘 | GPU |
| I2V 微動態 x12 | Wan 2.2 I2V 14B | 60-90 分鐘 | GPU |
| Ken Burns 效果 | FFmpeg zoompan | 5 分鐘 | CPU |
| 旁白生成 | Qwen3-TTS | 10-15 分鐘 | GPU |
| 音效生成 | MMAudio | 15-20 分鐘 | GPU |
| BGM 生成 | ACE-Step | 10-15 分鐘 | GPU |
| 字幕製作 | 手動 SRT | 15-20 分鐘 | - |
| 最終合併 | FFmpeg | 5-10 分鐘 | CPU |
| **總計** | | **約 3-5 小時** | |

### 資料夾結構建議

```
project_name/
├── script/
│   └── episode01.md          # 劇本
├── images/
│   ├── scene01.png
│   ├── scene02.png
│   └── ...
├── videos/
│   ├── scene01_i2v.mp4       # I2V 微動態輸出
│   ├── scene01_kb.mp4        # Ken Burns 效果輸出
│   └── ...
├── audio/
│   ├── narration/
│   │   ├── scene01.wav
│   │   └── ...
│   ├── sfx/
│   │   ├── scene01_sfx.wav
│   │   └── ...
│   ├── bgm/
│   │   └── bgm_01.wav
│   └── song/
│       └── ending_song.wav
├── subtitles/
│   └── episode01.srt
├── output/
│   └── episode01_final.mp4
├── filelist.txt              # FFmpeg concat 用
└── concat_video.js           # Node.js 合併腳本
```

---

## Part 3: 角色一致性

在 8-16 張圖中保持同一角色的外觀一致，是 AI 漫劇最大的挑戰之一。以下提供三種方法，依複雜度由低到高排列。

### 方法 1：固定 Seed + 詳細角色描述（推薦入門）

**原理**：在每張圖的 prompt 中都複製完全相同的角色描述段落，並使用固定 seed。

**角色描述模板**：

```
[CHARACTER] a cute chibi girl, short wavy brown hair with a small yellow star hairpin,
round face, big sparkling dark brown eyes, rosy cheeks, wearing an oversized cream-colored
knit sweater and a light blue scarf, small body proportions (3-head-tall chibi style)
```

**使用方式**：

```
[CHARACTER描述] + [場景描述] + [表情/情緒] + [風格關鍵字]
```

每張圖的 prompt 都以完全相同的 `[CHARACTER描述]` 開頭，只改變場景和情緒部分。

**注意事項**：
- Seed 固定有助於穩定，但不保證 100% 一致
- 角色描述越詳細越好，尤其是髮型、髮色、服裝、配件
- 生成後人工挑選最一致的結果（每場景生成 3-4 張，選最像的）

### 方法 2：IP-Adapter

**原理**：將一張角色參考圖作為 IP-Adapter 的輸入，引導模型生成相似角色。

**ComfyUI 設定**：
- 安裝 `ComfyUI-IPAdapter-Plus` 節點包
- 載入 IP-Adapter 模型（建議 `ip-adapter-plus-face_sdxl` 或對應版本）
- Weight 設定：0.6-0.8（太高會限制構圖自由度）

**優點**：角色一致性顯著提升
**缺點**：需要額外模型檔，增加 VRAM 消耗

### 方法 3：角色參考圖 + ControlNet

**原理**：用 ControlNet 的 Reference 模式，鎖定角色的姿態和外觀。

**適用場景**：
- 需要精確控制角色姿態時
- 半寫實風格的角色

**ComfyUI 設定**：
- 使用 ControlNet Reference-Only 預處理器
- Strength：0.5-0.7

### 實際建議

對於 **chibi 風格**的療癒漫劇，**方法 1 通常就足夠了**，原因是：
- Chibi 角色造型簡單，辨識特徵少（髮型 + 髮色 + 服裝即可辨識）
- 觀眾對 chibi 角色的「微小差異」容忍度高
- 不需要額外模型，省 VRAM 給 I2V 使用
- 搭配固定風格關鍵字（如 `chibi, kawaii, pastel colors`），穩定度很高

如果是寫實或半寫實風格，建議直接使用方法 2（IP-Adapter）。

---

## Part 4: 靜態圖生成

### ComfyUI 文生圖設定建議

| 參數 | 建議值 | 說明 |
|------|-------|------|
| Model | SDXL / Flux / Pony 系列 | 依畫風需求選擇 |
| 解析度 | 1080x1920（直式）或 1920x1080（橫式） | 見下方說明 |
| Steps | 25-35 | 太少細節不足，太多浪費時間 |
| CFG Scale | 5-8 | Flux 系列可用 1-3.5 |
| Sampler | Euler / DPM++ 2M Karras | 穩定且品質好 |
| Seed | 固定值 | 同角色固定 seed 有助一致性 |
| Batch Size | 4 | 每場景生成 4 張挑選 |
| VAE | 模型自帶或 sdxl_vae | 確保色彩正確 |

### 解析度選擇

- **1080x1920（9:16 直式）**：適合手機觀看、YouTube Shorts、Instagram Reels
- **1920x1080（16:9 橫式）**：適合 YouTube 長影片、電腦觀看
- **建議**：療癒漫劇以長影片為主，優先考慮 1920x1080；若同時經營 Shorts，可另外裁切

### Prompt 結構

```
[角色描述] + [場景描述] + [情緒/表情] + [燈光/氛圍] + [風格關鍵字]
```

**範例 Prompt**：

```
a cute chibi girl with short wavy brown hair and yellow star hairpin, big sparkling
dark brown eyes, rosy cheeks, wearing oversized cream knit sweater and light blue scarf,
sitting by a window in a cozy cafe, holding a warm cup of cocoa with both hands,
gentle smile, eyes half-closed contentedly,
warm golden afternoon light streaming through the window, soft bokeh of rain outside,
chibi, kawaii, pastel colors, soft watercolor style, warm tones, studio ghibli inspired,
detailed background, cozy atmosphere
```

### Negative Prompt

```
ugly, deformed, bad anatomy, bad hands, extra fingers, missing fingers,
extra limbs, bad proportions, gross proportions, mutated, blurry, watermark,
text, signature, low quality, worst quality, jpeg artifacts, cropped,
out of frame, duplicate, morbid, mutilated, poorly drawn face,
mutation, extra legs, extra arms, disfigured, malformed limbs
```

### 場景規劃建議（以 12 場景為例）

| 場景 | 類型 | 說明 |
|-----|------|------|
| 01 | 開場 | 建立世界觀的全景/環境圖 |
| 02-03 | 日常 | 角色的日常生活場景 |
| 04-05 | 觸發 | 故事轉折點 |
| 06-08 | 發展 | 情感遞進的場景 |
| 09-10 | 高潮 | 情感最濃烈的畫面 |
| 11 | 收尾 | 回歸平靜 |
| 12 | 結尾 | 金句字卡 / 片尾畫面 |

---

## Part 5: 局部動態效果

漫劇的動態效果分為兩種，可以混合使用。

### 方式 1：I2V 微動態（Wan 2.2 I2V）

使用 SVI Pro Workflow 將靜態圖轉為 2-3 秒的微動態影片。

**ComfyUI / SVI Pro 設定建議**：

| 參數 | 建議值 | 說明 |
|------|-------|------|
| Model | Wan 2.2 I2V 14B | 已有模型 |
| 輸出幀數 | 49-81 幀 | 2-3 秒（@24fps） |
| Steps | 20-30 | 平衡品質與速度 |
| CFG | 3-5 | 過高容易抖動 |
| 解析度 | 與原圖一致 | 避免變形 |

**Prompt 技巧——只描述微小動態**：

```
# 好的 I2V prompt（微動態）
gentle breeze blowing through hair, soft eye blink, slight head tilt,
steam rising from the cup, leaves swaying gently

# 避免的 I2V prompt（動態太大）
character running, jumping, turning around, walking across the room
```

**適合微動態的元素**：
- 角色：眨眼、微笑變化、頭微微轉動、呼吸起伏
- 頭髮：風吹髮絲飄動
- 自然：水面波紋、樹葉搖曳、雲朵緩移、星光閃爍
- 環境：燭光搖曳、蒸氣上升、雨滴落下、光影流動
- 物件：窗簾飄動、書頁翻動

**VRAM 注意事項**：
- Wan 2.2 I2V 14B 在 16GB VRAM 下可能需要啟用模型卸載（offload to RAM）
- 64GB RAM 足以應付卸載需求
- 每段 I2V 約需 3-8 分鐘（依幀數與解析度）

### 方式 2：Ken Burns 效果（FFmpeg zoompan）

用 FFmpeg 的 `zoompan` 濾鏡對靜態圖做推拉搖移，完全不需要 GPU。

**優點**：
- 零 GPU 消耗，可與 I2V 並行處理
- 效果穩定可控，不會產生偽影
- 適合全景場景、環境建立鏡頭

#### Ken Burns FFmpeg 指令範例

**Zoom In（推進）—— 適合聚焦角色、強調細節**：

```bash
ffmpeg -loop 1 -i scene01.png \
  -vf "zoompan=z='min(zoom+0.001,1.3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=250:s=1080x1920:fps=25" \
  -t 10 -c:v libx264 -pix_fmt yuv420p scene01_zoomin.mp4
```

**Zoom Out（拉遠）—— 適合開場、展示全景**：

```bash
ffmpeg -loop 1 -i scene01.png \
  -vf "zoompan=z='if(eq(on,1),1.3,max(zoom-0.001,1))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=250:s=1080x1920:fps=25" \
  -t 10 -c:v libx264 -pix_fmt yuv420p scene01_zoomout.mp4
```

**Pan Left to Right（左到右平移）—— 適合展示橫幅場景**：

```bash
ffmpeg -loop 1 -i scene01.png \
  -vf "zoompan=z='1.3':x='if(eq(on,1),0,x+2)':y='ih/2-(ih/zoom/2)':d=250:s=1080x1920:fps=25" \
  -t 10 -c:v libx264 -pix_fmt yuv420p scene01_pan_lr.mp4
```

**Pan Right to Left（右到左平移）**：

```bash
ffmpeg -loop 1 -i scene01.png \
  -vf "zoompan=z='1.3':x='if(eq(on,1),iw,x-2)':y='ih/2-(ih/zoom/2)':d=250:s=1080x1920:fps=25" \
  -t 10 -c:v libx264 -pix_fmt yuv420p scene01_pan_rl.mp4
```

**Pan Top to Bottom（上到下平移）—— 適合展示高聳場景**：

```bash
ffmpeg -loop 1 -i scene01.png \
  -vf "zoompan=z='1.3':x='iw/2-(iw/zoom/2)':y='if(eq(on,1),0,y+2)':d=250:s=1080x1920:fps=25" \
  -t 10 -c:v libx264 -pix_fmt yuv420p scene01_pan_tb.mp4
```

#### 參數說明

| 參數 | 說明 |
|------|------|
| `z` | 縮放倍率（1.0 = 原始大小，1.3 = 放大 30%） |
| `x`, `y` | 裁切框左上角座標 |
| `d` | 總幀數（d=250, fps=25 → 10 秒） |
| `s` | 輸出解析度 |
| `fps` | 輸出幀率 |
| `-t` | 輸出時長（秒） |

#### 動態選擇建議

| 場景類型 | 推薦動態方式 |
|---------|------------|
| 角色特寫 | I2V 微動態（眨眼、微表情） |
| 環境全景 | Ken Burns Zoom Out |
| 情感高潮 | I2V 微動態 + 慢速 Zoom In |
| 場景轉換 | Ken Burns Pan |
| 靜態金句 | 不加動態或極慢 Zoom In |

---

## Part 6: 旁白製作

### Qwen3-TTS 生成中文旁白

Qwen3-TTS 1.7B 支援中文語音合成，適合生成療癒風格的旁白。

**基本使用流程**：

1. 準備旁白文本（每場景一段）
2. 設定語速與情緒參數
3. 逐場景生成 WAV 檔案
4. 檢查時長並調整

### 語速控制建議

| 內容類型 | 建議語速 | 說明 |
|---------|---------|------|
| 療癒旁白 | 偏慢（0.7-0.85x） | 留白感，讓觀眾沉浸 |
| 敘事說明 | 正常（0.9-1.0x） | 清晰傳達訊息 |
| 情感高潮 | 慢速（0.6-0.75x） | 強調情感重量 |
| 輕鬆日常 | 稍快（0.95-1.05x） | 活潑感 |

### 時長配置原則

```
每場景旁白時長 = 場景影片時長 - 0.5 秒（頭尾各留 0.25 秒呼吸空間）
```

**範例**：若場景影片長 8 秒，旁白應控制在 7.5 秒以內。

如果旁白時長超過場景時長：
- 優先精簡文字（療癒內容「少即是多」）
- 其次加長場景影片（延長 Ken Burns 動態）
- 最後才考慮加快語速

### 情緒語氣標註方式

在旁白文本中用括號標註情緒，協助 TTS 調整語氣：

```
（溫柔地）那是一個很普通的下午。
（輕聲地）窗外的雨，一滴一滴地落著。
（帶著微笑）但不知道為什麼......心裡覺得特別安靜。
（感慨地）原來，幸福有時候就是這麼簡單的事情。
```

### 旁白腳本範例

```
場景 01（8秒）—— 開場
語氣：溫柔、平靜
文字：「你有沒有過這樣的時刻？什麼都不想做，只想靜靜地待著。」

場景 02（7秒）—— 日常
語氣：輕快、日常
文字：「小星最喜歡的事情，就是在雨天窩在沙發上，聽雨聲。」
```

---

## Part 7: 音訊整合

### MMAudio：環境音效生成

MMAudio 可以根據場景圖片自動生成匹配的環境音效。

**使用流程**：
1. 輸入場景圖片（或影片）
2. 可選：附加文字描述（如 `rain on window, indoor cafe ambience, gentle`）
3. 生成環境音效 WAV

**適合生成的音效類型**：
- 自然環境：雨聲、風聲、鳥鳴、蟲鳴、流水聲
- 室內環境：咖啡廳環境音、壁爐噼啪聲、時鐘滴答聲
- 城市環境：遠處車聲、腳步聲

**不適合的音效**（建議用現成音效庫）：
- 精確的 UI 音效
- 特定樂器聲
- 人聲（交給 TTS）

### ACE-Step：BGM 生成

ACE-Step 可以生成原創背景音樂。

**BGM 設定建議**：
- 長度：與整集影片等長，或生成 2-3 段 loop
- 風格關鍵字：`lofi, gentle piano, ambient, warm, peaceful, acoustic guitar`
- BPM：60-90（療癒內容適合慢節奏）
- 注意：確保 BGM 不含人聲，避免與旁白衝突

### 原創歌曲整合

如果有自錄的原創歌曲，可以作為：
- **插曲**：在情感高潮場景（場景 09-10）播放
- **片尾曲**：在最後場景 + 製作名單播放

### 混音建議

音量比例（以旁白為基準）：

| 音軌 | 相對音量 | 說明 |
|------|---------|------|
| 旁白 | 1.0（0 dB） | 最清晰，永遠是主角 |
| 音效 | 0.5（-6 dB） | 氛圍補充，不搶旁白 |
| BGM | 0.3（-10 dB） | 底層氛圍，幾乎不被注意但少了會空 |

**FFmpeg 混音指令範例**：

```bash
# 調整音效音量為 0.5
ffmpeg -i sfx.wav -filter:a "volume=0.5" sfx_adjusted.wav

# 調整 BGM 音量為 0.3
ffmpeg -i bgm.wav -filter:a "volume=0.3" bgm_adjusted.wav

# 合併三軌音訊
ffmpeg -i narration.wav -i sfx_adjusted.wav -i bgm_adjusted.wav \
  -filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=longest:dropout_transition=2" \
  mixed_audio.wav
```

**進階混音（單條指令）**：

```bash
ffmpeg -i narration.wav -i sfx.wav -i bgm.wav \
  -filter_complex "[1:a]volume=0.5[sfx];[2:a]volume=0.3[bgm];[0:a][sfx][bgm]amix=inputs=3:duration=longest" \
  mixed_audio.wav
```

---

## Part 8: 字幕與金句字卡

### SRT 字幕格式範例

```srt
1
00:00:01,000 --> 00:00:05,500
你有沒有過這樣的時刻？

2
00:00:05,500 --> 00:00:08,000
什麼都不想做，只想靜靜地待著。

3
00:00:09,000 --> 00:00:14,000
小星最喜歡的事情，
就是在雨天窩在沙發上，聽雨聲。

4
00:00:15,000 --> 00:00:19,500
雨滴打在窗戶上的聲音，
像是世界在輕輕說著：「沒關係。」

5
00:00:21,000 --> 00:00:26,000
原來，幸福有時候
就是這麼簡單的事情。
```

**字幕製作要點**：
- 每行不超過 15-18 個中文字
- 超過 18 字就分兩行
- 時間軸與旁白音訊對齊
- 場景之間留 0.5-1 秒無字幕空白

### FFmpeg 燒字幕指令

**軟字幕（封裝進 MP4，可開關）**：

```bash
ffmpeg -i video.mp4 -i subtitles.srt \
  -c:v copy -c:a copy -c:s mov_text \
  video_with_sub.mp4
```

**硬字幕（燒進畫面，無法關閉但相容性最好）**：

```bash
ffmpeg -i video.mp4 \
  -vf "subtitles=subtitles.srt:force_style='FontName=Microsoft JhengHei,FontSize=22,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Shadow=1,MarginV=40'" \
  -c:v libx264 -crf 18 -c:a copy \
  video_hardsub.mp4
```

**字幕樣式參數說明**：

| 參數 | 說明 | 建議值 |
|------|------|-------|
| FontName | 字體 | Microsoft JhengHei（微軟正黑體） |
| FontSize | 字號 | 20-24（直式影片可稍大） |
| PrimaryColour | 文字顏色 | &H00FFFFFF（白色） |
| OutlineColour | 描邊顏色 | &H00000000（黑色） |
| Outline | 描邊寬度 | 2 |
| Shadow | 陰影 | 1 |
| MarginV | 底部邊距 | 40-60 |

### 金句字卡

在影片最後一個場景疊加金句文字，用 FFmpeg 的 `drawtext` 濾鏡。

**基本金句字卡**：

```bash
ffmpeg -i final_scene.mp4 \
  -vf "drawtext=text='幸福，就是這麼簡單的事情。':fontfile='C\\:/Windows/Fonts/msjh.ttc':fontsize=36:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=(h-text_h)/2" \
  -c:v libx264 -crf 18 -c:a copy \
  final_scene_with_quote.mp4
```

**漸入漸出金句字卡**：

```bash
ffmpeg -i final_scene.mp4 \
  -vf "drawtext=text='幸福，就是這麼簡單的事情。':fontfile='C\\:/Windows/Fonts/msjh.ttc':fontsize=36:fontcolor=white@0:borderw=3:bordercolor=black@0:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(t,2,8)':alpha='if(lt(t,3),t-2,if(gt(t,7),8-t,1))'" \
  -c:v libx264 -crf 18 -c:a copy \
  final_scene_with_quote.mp4
```

上例效果：文字在第 2 秒開始漸入、第 3 秒完全顯示、第 7 秒開始漸出、第 8 秒完全消失。

---

## Part 9: 最終合併

### 步驟 1：準備各場景影片（已含場景音效）

先將每個場景的影片與對應音效合併：

```bash
ffmpeg -i videos/scene01_kb.mp4 -i audio/narration/scene01.wav -i audio/sfx/scene01_sfx.wav \
  -filter_complex "[1:a]volume=1.0[nar];[2:a]volume=0.5[sfx];[nar][sfx]amix=inputs=2:duration=longest[a]" \
  -map 0:v -map "[a]" -c:v libx264 -crf 18 -c:a aac -b:a 192k \
  videos/scene01_final.mp4
```

### 步驟 2：建立 filelist.txt

```
file 'videos/scene01_final.mp4'
file 'videos/scene02_final.mp4'
file 'videos/scene03_final.mp4'
file 'videos/scene04_final.mp4'
file 'videos/scene05_final.mp4'
file 'videos/scene06_final.mp4'
file 'videos/scene07_final.mp4'
file 'videos/scene08_final.mp4'
file 'videos/scene09_final.mp4'
file 'videos/scene10_final.mp4'
file 'videos/scene11_final.mp4'
file 'videos/scene12_final.mp4'
```

### 步驟 3：用 FFmpeg concat 合併所有場景

```bash
ffmpeg -f concat -safe 0 -i filelist.txt \
  -c:v libx264 -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  output/episode01_no_bgm.mp4
```

### 步驟 4：疊加 BGM

```bash
ffmpeg -i output/episode01_no_bgm.mp4 -i audio/bgm/bgm_01.wav \
  -filter_complex "[1:a]volume=0.3[bgm];[0:a][bgm]amix=inputs=2:duration=first[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k \
  output/episode01_with_bgm.mp4
```

### 步驟 5：燒字幕

```bash
ffmpeg -i output/episode01_with_bgm.mp4 \
  -vf "subtitles=subtitles/episode01.srt:force_style='FontName=Microsoft JhengHei,FontSize=22,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Shadow=1,MarginV=40'" \
  -c:v libx264 -crf 18 -c:a copy \
  output/episode01_final.mp4
```

### 或者：使用 Node.js concat_video.js 腳本

如果已有自定義的 `concat_video.js` 腳本，可以將上述流程自動化：

```bash
node concat_video.js --input videos/ --audio audio/ --subtitle subtitles/episode01.srt --output output/episode01_final.mp4
```

（指令參數依腳本實作而定，請參考腳本內的說明。）

### 最終輸出規格

| 參數 | 建議值 |
|------|-------|
| 編碼 | H.264 (libx264) |
| CRF | 18（高品質，檔案適中） |
| 像素格式 | yuv420p |
| 解析度 | 1080x1920（直式）或 1920x1080（橫式） |
| 幀率 | 25 fps |
| 音訊編碼 | AAC |
| 音訊位元率 | 192 kbps |
| 預估檔案大小 | 5 分鐘約 150-300 MB |

---

## Part 10: 上傳清單

### YouTube 上傳建議

#### 標題格式

```
【療癒漫劇】EP01：下雨天的小確幸 ☔ | 治癒系動畫 | Healing Animation
```

結構：`【類型標籤】集數：主標題 emoji | 關鍵字1 | 關鍵字2`

#### 描述模板

```
🌧️ 療癒漫劇 EP01：下雨天的小確幸

在一個普通的雨天下午，小星發現了生活中最簡單的幸福......

━━━━━━━━━━━━━━━━━━━━
📌 這部漫劇使用 AI 工具製作：
• 繪圖：Stable Diffusion (ComfyUI)
• 動態：Wan 2.2 I2V
• 旁白：Qwen3-TTS
• 音效：MMAudio
• 配樂：ACE-Step
• 剪輯：FFmpeg

━━━━━━━━━━━━━━━━━━━━
🎵 片尾曲：《[歌曲名]》（原創）

━━━━━━━━━━━━━━━━━━━━
⏰ 時間軸
00:00 開場
00:30 小星的日常
02:15 雨天的發現
04:00 小確幸
05:30 片尾

━━━━━━━━━━━━━━━━━━━━
#療癒 #治癒系 #漫劇 #motioncomic #AI動畫 #healing
```

#### 標籤建議

```
療癒, 治癒系, 漫劇, motion comic, AI動畫, healing animation,
療癒動畫, 暖心, 小確幸, chibi, 可愛, kawaii, lofi,
放鬆, 助眠, relaxing, 中文旁白, 原創動畫
```

#### 縮圖建議

- 從最有視覺衝擊力的場景截圖
- 加上大字標題（3-5 個字）
- 色彩鮮明、構圖簡潔
- 建議尺寸：1280x720

#### 排程建議

- 固定更新日（如每週三、週六）
- 上傳時間：晚上 7-9 點（台灣時區）
- 提前 1-2 天上傳，設定排程發布

### 漫劇 vs Shorts 的上傳差異

| 項目 | 漫劇（長影片） | Shorts |
|------|-------------|--------|
| 長度 | 3-10 分鐘 | ≤ 60 秒 |
| 解析度 | 1920x1080 或 1080x1920 | 1080x1920（必須直式） |
| 內容 | 完整故事 | 單一場景 / 金句片段 |
| 用途 | 主要內容 | 導流到長影片 |
| 標題 | 含集數、完整標題 | 短標題 + hook |
| 描述 | 完整描述 + 時間軸 | 簡短 + 「完整版看這裡 →」 |
| 標籤 | 完整標籤組 | #Shorts 必須包含 |

**Shorts 導流策略**：
- 從長影片中截取最有吸引力的 30-60 秒片段
- 結尾加上文字：「完整故事在頻道裡 →」
- 在 Shorts 描述放長影片連結

---

## 附錄：快速檢查清單

### 製作前

- [ ] 劇本完成，場景數確定（8-16 場景）
- [ ] 角色描述模板寫好
- [ ] 資料夾結構建立

### 製作中

- [ ] 所有場景圖已生成並挑選
- [ ] 角色一致性確認（肉眼檢查 12 張圖排列）
- [ ] I2V / Ken Burns 動態已生成
- [ ] 旁白已生成，時長正確
- [ ] 音效已生成
- [ ] BGM 已生成 / 準備好
- [ ] SRT 字幕已寫好，時間軸對齊

### 合併後

- [ ] 影片整體播放一次，檢查：
  - [ ] 場景轉場是否順暢
  - [ ] 旁白與畫面是否同步
  - [ ] 音量比例是否舒適
  - [ ] 字幕是否正確顯示
  - [ ] 金句字卡是否出現在正確時間
- [ ] 輸出檔案規格正確（H.264, CRF 18）
- [ ] 檔案大小合理

### 上傳前

- [ ] 標題、描述、標籤已準備
- [ ] 縮圖已製作
- [ ] 排程時間已設定
- [ ] Shorts 片段已準備（如需要）
