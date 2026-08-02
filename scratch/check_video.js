import fs from 'fs';
import path from 'path';

const videoPath = path.join(process.cwd(), 'public', 'hero-video.mp4');
const buffer = fs.readFileSync(videoPath);

console.log('Video size:', buffer.length, 'bytes');

// Check for mp4 audio track atom (mp4a or soun)
const hasAudioTrack = buffer.includes(Buffer.from('mp4a')) || buffer.includes(Buffer.from('soun'));
console.log('Has audio track:', hasAudioTrack);
