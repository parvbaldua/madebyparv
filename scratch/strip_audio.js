import fs from 'fs';
import path from 'path';

const videoPath = path.join(process.cwd(), 'public', 'hero-video.mp4');
const outputPath = path.join(process.cwd(), 'public', 'hero-video.mp4');

const buf = fs.readFileSync(videoPath);
console.log('Original size:', buf.length);

// Find 'soun' inside hdlr atom and replace with 'vide' or nullify audio track type
let count = 0;
const target = Buffer.from('soun');
const replacement = Buffer.from('vide');

for (let i = 0; i < buf.length - 4; i++) {
  if (buf[i] === target[0] && buf[i+1] === target[1] && buf[i+2] === target[2] && buf[i+3] === target[3]) {
    console.log('Found soun at offset:', i);
    // Check if preceded by hdlr
    const hdlrOffset = i - 8;
    if (hdlrOffset >= 0 && buf.toString('ascii', hdlrOffset, hdlrOffset + 4) === 'hdlr') {
      console.log('Replacing hdlr soun with vide at offset:', i);
      replacement.copy(buf, i);
      count++;
    }
  }
}

fs.writeFileSync(outputPath, buf);
console.log('Replaced', count, 'audio track handlers.');
