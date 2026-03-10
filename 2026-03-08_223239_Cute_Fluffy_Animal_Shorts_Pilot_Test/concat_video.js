/**
 * Video Concatenation Script
 * Concatenates multiple 6-second clips into one complete episode video.
 * Optionally adds background music and simple text overlay.
 *
 * Prerequisites: FFmpeg must be installed and in PATH
 *
 * Usage:
 *   node concat_video.js --input ./clips/ --output ./output/episode01.mp4
 *   node concat_video.js --input ./clips/ --output ./output/episode01.mp4 --music ./music/bgm.mp3
 *   node concat_video.js --input ./clips/ --output ./output/episode01.mp4 --music ./music/bgm.mp3 --title "The Cookie Heist"
 *   node concat_video.js --input ./clips/ --output ./output/episode01.mp4 --music ./music/bgm.mp3 --narration ./narration/ep01_narration.wav --title "The Cookie Heist"
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

if (!args.input || !args.output) {
  console.log(`
Usage:
  node concat_video.js --input <clips_dir> --output <output.mp4> [--music <bgm.mp3>] [--title "Episode Title"]

Options:
  --input    Directory containing video clips (sorted alphabetically)
  --output   Output file path
  --music    (Optional) Background music file
  --narration (Optional) Narration voiceover file (volume 80%)
  --crossfade (Optional) Crossfade duration in seconds between clips (e.g. 0.3)
  --title    (Optional) Title text overlay (shown first 3 seconds)

Extract last frame (for scene chaining):
  node concat_video.js --extract <video.mp4> --frame <output.png>
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
