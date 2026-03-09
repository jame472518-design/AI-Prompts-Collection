# MMAudio + ACE-Step 音訊整合 Pipeline 安裝與生成指南

## 完整 Pipeline 生成順序

```
Step 1: 文生圖 (Text-to-Image) → 角色起始圖
Step 2: 圖生影 (I2V, SVI Pro Workflow) → 6秒無聲影片
Step 3: 提取最後一幀 → 下一場景起始圖（重複 Step 2）
Step 4: MMAudio (Video-to-Audio) → 為每段影片生成同步音效
Step 5: ACE-Step (Text-to-Music) → 生成背景音樂 BGM
Step 6: FFmpeg 合併 → 多段影片 + 音效 + BGM = 完成品
```

---

## Part 1: 安裝 MMAudio（影片→音效）

### 1.1 Clone Custom Node

```bash
cd D:\ComfyUI\custom_nodes
git clone https://github.com/kijai/ComfyUI-MMAudio.git
```

```bash
# 用 ComfyUI 的 Python 安裝依賴
D:\ComfyUI\python_embeded\python.exe -m pip install -r D:\ComfyUI\custom_nodes\ComfyUI-MMAudio\requirements.txt
```

### 1.2 下載模型

全部放到 `D:\ComfyUI\models\mmaudio\` 資料夾：

| 檔案名稱 | 大小約 | 路徑 |
|----------|--------|------|
| `mmaudio_large_44k_v2_fp16.safetensors` | ~1.7GB | `models\mmaudio\` |
| `mmaudio_synchformer_fp16.safetensors` | ~200MB | `models\mmaudio\` |
| `mmaudio_vae_44k_fp16.safetensors` | ~150MB | `models\mmaudio\` |
| `apple_DFN5B-CLIP-ViT-H-14-384_fp16.safetensors` | ~2GB | `models\mmaudio\` |

**下載來源：** https://huggingface.co/Kijai/MMAudio_safetensors

> BigVGAN v2 模型會在第一次運行時自動下載到 `models\mmaudio\nvidia\bigvgan_v2_44khz_128band_512x\`

---

## Part 2: 安裝 ACE-Step（文字→音樂）

### 2.1 安裝 Custom Node

**方法 A — ComfyUI Manager（推薦）：**
在 ComfyUI Manager 中搜尋 "ACE-Step" → 一鍵安裝

**方法 B — 手動 Clone：**

```bash
cd D:\ComfyUI\custom_nodes
git clone https://github.com/ace-step/ACE-Step-ComfyUI.git
cd ACE-Step-ComfyUI
D:\ComfyUI\python_embeded\python.exe -m pip install -r requirements.txt
```

### 2.2 下載模型

**推薦 All-in-One 版本（單檔最簡單）：**

| 檔案名稱 | 大小約 | 路徑 |
|----------|--------|------|
| `ace_step_v1_3.5b.safetensors` | ~7GB | `models\checkpoints\` |

**下載來源：** https://huggingface.co/Comfy-Org/ACE-Step_ComfyUI_repackaged/tree/main/all_in_one

> ACE-Step 1.5 已發布，建議使用最新版。RTX 5070 Ti 上生成 4 分鐘音樂約 10 秒完成。

---

## Part 3: 逐步生成流程

### Step 1 — 生成角色起始圖

用文生圖 workflow（Flux、SD3.5 等），根據劇本的 Scene 1 Image Prompt 生成第一張圖：

```
An adorable chibi raccoon with oversized head, enormous sparkly eyes...
3D cartoon Pixar style, chibi proportions, kawaii aesthetic, 8k render
```

### Step 2 — SVI Pro I2V 生成 6 秒影片

1. 載入 `SVI-Pro-Workflow_animal.json`
2. 在 LoadImage 節點放入 Step 1 的圖片
3. 在 prompt 節點貼入對應場景的 I2V Motion Prompt
4. 生成 → 得到 `scene_01.mp4`（6 秒無聲）

### Step 3 — 提取最後一幀，生成下一場景

```bash
# 提取最後一幀作為下一場景的起始圖
node scripts/concat_video.js --extract scene_01.mp4 --frame scene_02_input.png
```

將 `scene_02_input.png` 放回 LoadImage，換 Scene 2 的 I2V prompt，重複生成。
**每集 4 場景 = 重複 4 次。**

### Step 4 — MMAudio 生成同步音效

在 ComfyUI 中使用 MMAudio 節點：

```
Load Video → MMAudio Loader → MMAudio Sampler → Save Audio
```

**MMAudio prompt 範例**（以 EP01 Scene 1 為例）：
```
soft footsteps on kitchen floor, gentle creaking door, quiet nighttime ambiance
```

每段 6 秒影片各生成一個對應音效。

> **重點：MMAudio 擅長音效同步，不擅長音樂生成。BGM 請用 ACE-Step。**

### Step 5 — ACE-Step 生成背景音樂

使用 ACE-Step 節點，貼入 Music Prompt：

```
sneaky spy pizzicato strings, tiptoeing staccato bass, building tension,
mysterious and playful, cartoon heist movie opening, 100 bpm, no vocals,
instrumental, cinematic spy comedy
```

- 設定長度 = 24-30 秒（整集長度）
- 生成 → 得到 `EP01_bgm.wav`

### Step 6 — FFmpeg 合併最終影片

```bash
# 串接 4 段影片 + 疊加 BGM
node scripts/concat_video.js \
  --input ./episodes/EP01_clips/ \
  --output ./output/EP01_cookie_heist.mp4 \
  --music ./music/EP01_bgm.mp3 \
  --title "The Cookie Heist"
```

如需同時保留 MMAudio 音效 + ACE-Step BGM，先將音效混入各片段，再串接加 BGM。

---

## Part 4: 推薦整合 Workflow

Civitai 上有現成的 **MMAudio + ACE-Step 整合 workflow**：

🔗 https://civitai.com/models/2207742/mmaudio-ace-step-musicsong-gen-workflow-for-videos

功能：
- 影片上傳 → MMAudio 音效 → ACE-Step BGM → 自動混合
- 音量控制、升頻、浮水印等
- 省去手動串接步驟

---

## 安裝檢查清單

| 項目 | 狀態 |
|------|------|
| FFmpeg 已安裝並在 PATH 中 | ☐ |
| MMAudio custom node 已 clone + 依賴已安裝 | ☐ |
| MMAudio 4 個模型已下載到 `models\mmaudio\` | ☐ |
| ACE-Step custom node 已安裝 | ☐ |
| ACE-Step 模型已下載到 `models\checkpoints\` | ☐ |
| 重啟 ComfyUI 確認節點出現 | ☐ |
| 試跑一段影片 → MMAudio 音效 ✓ | ☐ |
| 試跑一段 ACE-Step BGM ✓ | ☐ |
| 用 concat_video.js 合併測試 ✓ | ☐ |

---

## 硬體需求（已確認你的配置足夠）

| 元件 | 你的配置 | 需求 |
|------|----------|------|
| GPU | RTX 5070 Ti 16GB | MMAudio ~4GB VRAM, ACE-Step ~6GB VRAM ✓ |
| RAM | 64GB | 足夠 ✓ |
| 磁碟 | — | 模型總計約 ~11GB |

---

## 參考資源

- [kijai/ComfyUI-MMAudio (GitHub)](https://github.com/kijai/ComfyUI-MMAudio)
- [MMAudio 模型下載 (HuggingFace)](https://huggingface.co/Kijai/MMAudio_safetensors)
- [MMAudio 安裝說明 (DeepWiki)](https://deepwiki.com/kijai/ComfyUI-MMAudio/1.1-installation)
- [ACE-Step-ComfyUI (GitHub)](https://github.com/ace-step/ACE-Step-ComfyUI)
- [ACE-Step ComfyUI 教學 (ComfyUI Wiki)](https://comfyui-wiki.com/en/tutorial/advanced/audio/ace-step/ace-step-v1)
- [ACE-Step 1.5 公告 (Official Blog)](https://blog.comfy.org/p/ace-step-15-is-now-available-in-comfyui)
- [ACE-Step 模型下載 (HuggingFace)](https://huggingface.co/Comfy-Org/ACE-Step_ComfyUI_repackaged/tree/main/all_in_one)
- [MMAudio + ACE-Step 整合 Workflow (Civitai)](https://civitai.com/models/2207742/mmaudio-ace-step-musicsong-gen-workflow-for-videos)
- [ComfyUI ACE-Step 1.5 官方教學](https://docs.comfy.org/tutorials/audio/ace-step/ace-step-v1-5)
