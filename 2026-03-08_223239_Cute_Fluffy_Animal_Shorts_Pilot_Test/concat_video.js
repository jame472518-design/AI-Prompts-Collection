/**
 * Video Concatenation Script
 * Concatenates multiple clips into one complete episode video.
 * Supports two modes:
 *   - "shorts" (default): Concatenates 6-second I2V clips
 *   - "comic": Comic drama mode — static images with Ken Burns effect + narration + subtitles
 *
 * Prerequisites: FFmpeg must be installed and in PATH
 *
 * Usage (Shorts mode):
 *   node concat_video.js --input ./clips/ --output ./output/episode01.mp4
 *   node concat_video.js --input ./clips/ --output ./output/episode01.mp4 --music ./music/bgm.mp3 --crossfade 0.3
 *
 * Usage (Comic drama mode):
 *   node concat_video.js --mode comic --scenes ./scenes.json --output ./output/comic01.mp4
 *   node concat_video.js --mode comic --scenes ./scenes.json --output ./output/comic01.mp4 --music bgm.mp3 --subtitle subs.srt
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace('--', '');
    args[key] = argv[i + 1];
  }
  return args;
}

function findVideoFiles(dir) {
  const extensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
  const files = fs.readdirSync(dir)
    .filter(f => extensions.includes(path.extname(f).toLowerCase()))
    .sort(); // Sort alphabetically so scene_01, scene_02, etc. are in order
  return files.map(f => path.join(dir, f));
}

function createFileList(videos, listPath) {
  const content = videos.map(v => `file '${v.replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(listPath, content, 'utf8');
  return listPath;
}

function concatWithCrossfade(videos, outputPath, crossfadeDuration) {
  console.log(`Concatenating ${videos.length} clips with ${crossfadeDuration}s crossfade...`);

  if (videos.length < 2) {
    // Single video, just copy
    fs.copyFileSync(videos[0], outputPath);
    return;
  }

  // Build xfade filter chain for multiple videos
  // Each clip is assumed to be ~6 seconds
  const clipDuration = 6;
  const inputs = videos.map((v, i) => `-i "${v}"`).join(' ');
  const filterParts = [];
  let lastLabel = '[0]';

  for (let i = 1; i < videos.length; i++) {
    const offset = clipDuration * i - crossfadeDuration * i;
    const outLabel = i < videos.length - 1 ? `[v${i}]` : '[vout]';
    filterParts.push(
      `${lastLabel}[${i}]xfade=transition=fade:duration=${crossfadeDuration}:offset=${offset}${outLabel}`
    );
    lastLabel = outLabel;
  }

  const filterComplex = filterParts.join('; ');
  execSync(
    `ffmpeg -y ${inputs} -filter_complex "${filterComplex}" -map "[vout]" -c:v libx264 -crf 19 -preset fast "${outputPath}"`,
    { stdio: 'inherit' }
  );
}

function concat(videos, output, options = {}) {
  const tmpDir = path.dirname(output);
  const listPath = path.join(tmpDir, '_concat_list.txt');

  const hasPostProcessing = options.music || options.narration || options.title;

  // Step 1: Concatenate videos (with or without crossfade)
  const concatOutput = hasPostProcessing
    ? path.join(tmpDir, '_concat_temp.mp4')
    : output;

  if (options.crossfade && parseFloat(options.crossfade) > 0) {
    concatWithCrossfade(videos, concatOutput, parseFloat(options.crossfade));
  } else {
    // Simple concat (no crossfade)
    createFileList(videos, listPath);
    console.log(`Concatenating ${videos.length} clips...`);
    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${listPath}" -c copy "${concatOutput}"`,
      { stdio: 'inherit' }
    );
  }

  let currentInput = concatOutput;

  // Step 2: Add background music (if provided)
  if (options.music) {
    const musicOutput = options.title
      ? path.join(tmpDir, '_music_temp.mp4')
      : output;

    console.log(`Adding background music: ${options.music}`);
    execSync(
      `ffmpeg -y -i "${currentInput}" -i "${options.music}" ` +
      `-filter_complex "[1:a]volume=0.3,afade=t=out:st=${videos.length * 6 - 2}:d=2[bg]; ` +
      `[0:a][bg]amix=inputs=2:duration=first:dropout_transition=2[a]" ` +
      `-map 0:v -map "[a]" -c:v copy -c:a aac -shortest "${musicOutput}"`,
      { stdio: 'inherit' }
    );

    // Clean up temp
    if (currentInput !== output) fs.unlinkSync(currentInput);
    currentInput = musicOutput;
  }

  // Step 3: Add narration voiceover (if provided)
  if (options.narration) {
    const narrationOutput = options.title
      ? path.join(tmpDir, '_narration_temp.mp4')
      : output;

    console.log(`Adding narration: ${options.narration}`);
    execSync(
      `ffmpeg -y -i "${currentInput}" -i "${options.narration}" ` +
      `-filter_complex "[1:a]volume=0.8[vo]; ` +
      `[0:a][vo]amix=inputs=2:duration=first:dropout_transition=2[a]" ` +
      `-map 0:v -map "[a]" -c:v copy -c:a aac -shortest "${narrationOutput}"`,
      { stdio: 'inherit' }
    );

    if (currentInput !== output) fs.unlinkSync(currentInput);
    currentInput = narrationOutput;
  }

  // Step 4: Add title text overlay (if provided)
  if (options.title) {
    console.log(`Adding title: ${options.title}`);
    execSync(
      `ffmpeg -y -i "${currentInput}" ` +
      `-vf "drawtext=text='${options.title}':fontsize=36:fontcolor=white:` +
      `borderw=2:bordercolor=black:x=(w-text_w)/2:y=h-80:` +
      `enable='between(t,0,3)':alpha='if(lt(t,0.5),t/0.5,if(gt(t,2.5),(3-t)/0.5,1))'" ` +
      `-c:a copy "${output}"`,
      { stdio: 'inherit' }
    );

    if (currentInput !== output) fs.unlinkSync(currentInput);
  }

  // Clean up
  if (fs.existsSync(listPath)) fs.unlinkSync(listPath);

  const stats = fs.statSync(output);
  console.log(`\nDone! Output: ${output} (${(stats.size / 1024 / 1024).toFixed(1)} MB)`);
}

// ==========================================
// Comic Drama Mode (漫劇模式)
// ==========================================

/**
 * Ken Burns effect presets
 * Each preset defines zoompan filter parameters for FFmpeg
 */
const KEN_BURNS_PRESETS = {
  'zoom-in': (d, fps) =>
    `zoompan=z='min(zoom+0.0015,1.4)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${d * fps}:s=1080x1920:fps=${fps}`,
  'zoom-out': (d, fps) =>
    `zoompan=z='if(eq(on,1),1.4,max(zoom-0.0015,1))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${d * fps}:s=1080x1920:fps=${fps}`,
  'pan-left': (d, fps) =>
    `zoompan=z='1.3':x='if(eq(on,1),iw*0.3/(1.3),x-1)':y='ih/2-(ih/zoom/2)':d=${d * fps}:s=1080x1920:fps=${fps}`,
  'pan-right': (d, fps) =>
    `zoompan=z='1.3':x='if(eq(on,1),0,x+1)':y='ih/2-(ih/zoom/2)':d=${d * fps}:s=1080x1920:fps=${fps}`,
  'pan-up': (d, fps) =>
    `zoompan=z='1.3':x='iw/2-(iw/zoom/2)':y='if(eq(on,1),ih*0.3/(1.3),y-1)':d=${d * fps}:s=1080x1920:fps=${fps}`,
  'pan-down': (d, fps) =>
    `zoompan=z='1.3':x='iw/2-(iw/zoom/2)':y='if(eq(on,1),0,y+1)':d=${d * fps}:s=1080x1920:fps=${fps}`,
  'none': (d, fps) =>
    `zoompan=z='1':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${d * fps}:s=1080x1920:fps=${fps}`,
};

/**
 * Generate a video clip from a static image using Ken Burns effect
 * @param {string} imagePath - Path to the static image
 * @param {string} outputPath - Output video path
 * @param {number} duration - Duration in seconds
 * @param {string} camera - Ken Burns preset name
 * @param {number} fps - Frames per second (default 25)
 */
function applyKenBurns(imagePath, outputPath, duration, camera = 'zoom-in', fps = 25) {
  const preset = KEN_BURNS_PRESETS[camera] || KEN_BURNS_PRESETS['zoom-in'];
  const filter = preset(duration, fps);
  console.log(`  Ken Burns [${camera}] on ${path.basename(imagePath)} (${duration}s)...`);
  execSync(
    `ffmpeg -y -loop 1 -i "${imagePath}" -vf "${filter}" -t ${duration} -c:v libx264 -pix_fmt yuv420p -crf 19 -preset fast "${outputPath}"`,
    { stdio: 'inherit' }
  );
}

/**
 * Comic drama pipeline
 * Reads a scenes.json file and assembles a complete comic drama video
 *
 * scenes.json format:
 * {
 *   "title": "回家的路",
 *   "fps": 25,
 *   "resolution": "1080x1920",
 *   "scenes": [
 *     {
 *       "image": "./images/scene01.png",
 *       "video": null,
 *       "duration": 8,
 *       "camera": "zoom-out",
 *       "narration": "./audio/narration_01.wav",
 *       "sfx": "./audio/sfx_01.wav"
 *     },
 *     {
 *       "image": null,
 *       "video": "./clips/scene02_motion.mp4",
 *       "duration": 8,
 *       "camera": "none",
 *       "narration": "./audio/narration_02.wav",
 *       "sfx": null
 *     }
 *   ]
 * }
 */
function buildComicDrama(scenesJsonPath, outputPath, options = {}) {
  const scenesData = JSON.parse(fs.readFileSync(scenesJsonPath, 'utf8'));
  const scenes = scenesData.scenes;
  const fps = scenesData.fps || 25;
  const baseDir = path.dirname(scenesJsonPath);
  const tmpDir = path.dirname(outputPath);

  console.log(`\n=== Comic Drama: ${scenesData.title || 'Untitled'} ===`);
  console.log(`Scenes: ${scenes.length} | FPS: ${fps}\n`);

  const sceneVideos = [];

  // Step 1: Generate video for each scene (Ken Burns or use existing video)
  console.log('Step 1: Generating scene videos...');
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const sceneOutput = path.join(tmpDir, `_comic_scene_${String(i + 1).padStart(2, '0')}.mp4`);

    if (scene.video) {
      // Use pre-made I2V video clip (for scenes with motion effects)
      const videoSrc = path.resolve(baseDir, scene.video);
      fs.copyFileSync(videoSrc, sceneOutput);
      console.log(`  Scene ${i + 1}: Using I2V video ${path.basename(scene.video)}`);
    } else if (scene.image) {
      // Apply Ken Burns to static image
      const imageSrc = path.resolve(baseDir, scene.image);
      applyKenBurns(imageSrc, sceneOutput, scene.duration, scene.camera || 'zoom-in', fps);
    }

    sceneVideos.push(sceneOutput);
  }

  // Step 2: Add per-scene narration and SFX
  console.log('\nStep 2: Adding per-scene audio...');
  const sceneWithAudio = [];
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const hasAudio = scene.narration || scene.sfx;
    const audioOutput = path.join(tmpDir, `_comic_scene_audio_${String(i + 1).padStart(2, '0')}.mp4`);

    if (hasAudio) {
      let audioInputs = '';
      let filterParts = [];
      let inputIdx = 1;

      audioInputs += ` -i "${sceneVideos[i]}"`;

      if (scene.narration) {
        const narSrc = path.resolve(baseDir, scene.narration);
        audioInputs += ` -i "${narSrc}"`;
        filterParts.push(`[${inputIdx}:a]volume=1.0[nar]`);
        inputIdx++;
      }
      if (scene.sfx) {
        const sfxSrc = path.resolve(baseDir, scene.sfx);
        audioInputs += ` -i "${sfxSrc}"`;
        filterParts.push(`[${inputIdx}:a]volume=0.5[sfx]`);
        inputIdx++;
      }

      // Mix audio tracks
      let mixFilter = '';
      if (scene.narration && scene.sfx) {
        mixFilter = `${filterParts.join('; ')}; [nar][sfx]amix=inputs=2:duration=first[a]`;
      } else if (scene.narration) {
        mixFilter = `${filterParts[0].replace('[nar]', '[a]')}`;
      } else {
        mixFilter = `${filterParts[0].replace('[sfx]', '[a]')}`;
      }

      console.log(`  Scene ${i + 1}: Mixing audio...`);
      execSync(
        `ffmpeg -y${audioInputs} -filter_complex "${mixFilter}" -map 0:v -map "[a]" -c:v copy -c:a aac -shortest "${audioOutput}"`,
        { stdio: 'inherit' }
      );
      sceneWithAudio.push(audioOutput);
    } else {
      // Add silent audio track for concat compatibility
      console.log(`  Scene ${i + 1}: Adding silent audio...`);
      execSync(
        `ffmpeg -y -i "${sceneVideos[i]}" -f lavfi -i anullsrc=r=44100:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -shortest "${audioOutput}"`,
        { stdio: 'inherit' }
      );
      sceneWithAudio.push(audioOutput);
    }
  }

  // Step 3: Concatenate all scenes with crossfade
  console.log('\nStep 3: Concatenating scenes...');
  const crossfade = options.crossfade ? parseFloat(options.crossfade) : 0.5;
  const concatOutput = (options.music || options.subtitle)
    ? path.join(tmpDir, '_comic_concat.mp4')
    : outputPath;

  if (crossfade > 0 && sceneWithAudio.length >= 2) {
    // Build xfade with variable durations
    const inputs = sceneWithAudio.map((v) => `-i "${v}"`).join(' ');
    const filterParts = [];
    let lastLabel = '[0]';
    let accumulatedOffset = 0;

    for (let i = 0; i < scenes.length - 1; i++) {
      accumulatedOffset += scenes[i].duration - crossfade;
      const outLabel = i < scenes.length - 2 ? `[v${i}]` : '[vout]';
      filterParts.push(
        `${lastLabel}[${i + 1}]xfade=transition=fade:duration=${crossfade}:offset=${accumulatedOffset.toFixed(2)}${outLabel}`
      );
      lastLabel = outLabel;
    }

    const filterComplex = filterParts.join('; ');
    execSync(
      `ffmpeg -y ${inputs} -filter_complex "${filterComplex}" -map "[vout]" -c:v libx264 -crf 19 -preset fast "${concatOutput}"`,
      { stdio: 'inherit' }
    );
  } else {
    // Simple concat
    const listPath = path.join(tmpDir, '_comic_concat_list.txt');
    createFileList(sceneWithAudio, listPath);
    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${listPath}" -c copy "${concatOutput}"`,
      { stdio: 'inherit' }
    );
    if (fs.existsSync(listPath)) fs.unlinkSync(listPath);
  }

  let currentInput = concatOutput;

  // Step 4: Add background music / original song
  if (options.music) {
    const musicOutput = options.subtitle
      ? path.join(tmpDir, '_comic_music.mp4')
      : outputPath;

    const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
    console.log(`\nStep 4: Adding BGM/song: ${options.music}`);
    execSync(
      `ffmpeg -y -i "${currentInput}" -i "${options.music}" ` +
      `-filter_complex "[1:a]volume=0.3,afade=t=out:st=${totalDuration - 3}:d=3[bg]; ` +
      `[0:a][bg]amix=inputs=2:duration=first:dropout_transition=2[a]" ` +
      `-map 0:v -map "[a]" -c:v copy -c:a aac -shortest "${musicOutput}"`,
      { stdio: 'inherit' }
    );
    if (currentInput !== outputPath) fs.unlinkSync(currentInput);
    currentInput = musicOutput;
  }

  // Step 5: Burn subtitles (SRT file)
  if (options.subtitle) {
    console.log(`\nStep 5: Burning subtitles: ${options.subtitle}`);
    const subPath = options.subtitle.replace(/\\/g, '/').replace(/:/g, '\\:');
    execSync(
      `ffmpeg -y -i "${currentInput}" ` +
      `-vf "subtitles='${subPath}':force_style='FontSize=20,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,MarginV=40'" ` +
      `-c:a copy "${outputPath}"`,
      { stdio: 'inherit' }
    );
    if (currentInput !== outputPath) fs.unlinkSync(currentInput);
  }

  // Cleanup temp files
  sceneVideos.forEach(f => { if (fs.existsSync(f)) fs.unlinkSync(f); });
  sceneWithAudio.forEach(f => { if (fs.existsSync(f)) fs.unlinkSync(f); });

  const stats = fs.statSync(outputPath);
  console.log(`\n=== Done! Output: ${outputPath} (${(stats.size / 1024 / 1024).toFixed(1)} MB) ===`);
}

// ==========================================
// Shorts Mode (原有功能)
// ==========================================

// Extract last frame from a video (for scene chaining)
function extractLastFrame(videoPath, outputImagePath) {
  console.log(`Extracting last frame from: ${videoPath}`);
  execSync(
    `ffmpeg -y -sseof -0.1 -i "${videoPath}" -frames:v 1 -q:v 2 "${outputImagePath}"`,
    { stdio: 'inherit' }
  );
  console.log(`Last frame saved to: ${outputImagePath}`);
}

// Main
const args = parseArgs();
const mode = args.mode || 'shorts';

if (mode === 'comic') {
  // Comic Drama Mode
  if (!args.scenes || !args.output) {
    console.log(`
Comic Drama Mode:
  node concat_video.js --mode comic --scenes <scenes.json> --output <output.mp4>

Options:
  --scenes     JSON file defining scenes (images, durations, camera, audio)
  --output     Output file path
  --music      (Optional) Background music or original song
  --subtitle   (Optional) SRT subtitle file for quote overlays
  --crossfade  (Optional) Crossfade duration between scenes (default: 0.5)

scenes.json format:
  {
    "title": "Episode Title",
    "fps": 25,
    "scenes": [
      {
        "image": "./images/scene01.png",   // Static image (use Ken Burns)
        "video": null,                      // OR pre-made I2V video clip
        "duration": 8,                      // Scene duration in seconds
        "camera": "zoom-in",               // Ken Burns: zoom-in/zoom-out/pan-left/pan-right/pan-up/pan-down/none
        "narration": "./audio/nar_01.wav",  // Per-scene narration audio
        "sfx": "./audio/sfx_01.wav"         // Per-scene sound effects
      }
    ]
  }
    `);
    process.exit(1);
  }

  buildComicDrama(args.scenes, args.output, {
    music: args.music,
    subtitle: args.subtitle,
    crossfade: args.crossfade,
  });

} else {
  // Shorts Mode (original)
  if (!args.input || !args.output) {
    console.log(`
Shorts Mode (default):
  node concat_video.js --input <clips_dir> --output <output.mp4> [--music <bgm.mp3>] [--title "Episode Title"]

Options:
  --input      Directory containing video clips (sorted alphabetically)
  --output     Output file path
  --music      (Optional) Background music file
  --narration  (Optional) Narration voiceover file (volume 80%)
  --crossfade  (Optional) Crossfade duration in seconds between clips (e.g. 0.3)
  --title      (Optional) Title text overlay (shown first 3 seconds)

Extract last frame (for scene chaining):
  node concat_video.js --extract <video.mp4> --frame <output.png>

Comic Drama Mode:
  node concat_video.js --mode comic --scenes <scenes.json> --output <output.mp4>
  (Use --mode comic for more details)
    `);
    process.exit(1);
  }

  if (args.extract) {
    extractLastFrame(args.extract, args.frame || 'last_frame.png');
  } else {
    const videos = findVideoFiles(args.input);
    if (videos.length === 0) {
      console.error('No video files found in ' + args.input);
      process.exit(1);
    }

    console.log('Found clips:');
    videos.forEach((v, i) => console.log(`  ${i + 1}. ${path.basename(v)}`));
    console.log();

    concat(videos, args.output, {
      music: args.music,
      narration: args.narration,
      crossfade: args.crossfade,
      title: args.title,
    });
  }
}
