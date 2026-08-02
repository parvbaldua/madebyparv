import fs from 'fs';
import path from 'path';

const videoPath = path.join(process.cwd(), 'public', 'hero-video.mp4');
const buf = fs.readFileSync(videoPath);

console.log('Original size:', buf.length);

const sounOffset = 2290;
if (buf.toString('ascii', sounOffset, sounOffset + 4) === 'soun') {
  console.log('Replacing soun with vide at offset 2290...');
  buf.write('vide', sounOffset, 4, 'ascii');
  fs.writeFileSync(videoPath, buf);
  console.log('Successfully modified hero-video.mp4 to visual-only MP4!');
} else {
  console.log('soun atom not found at offset 2290!');
}
