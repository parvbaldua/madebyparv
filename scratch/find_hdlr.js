import fs from 'fs';
import path from 'path';

const videoPath = path.join(process.cwd(), 'public', 'hero-video.mp4');
const buf = fs.readFileSync(videoPath);

const hdlr = Buffer.from('hdlr');
let idx = 0;
while ((idx = buf.indexOf(hdlr, idx)) !== -1) {
  console.log('hdlr at:', idx);
  console.log('bytes following hdlr:', buf.subarray(idx, idx + 30).toString('hex'));
  console.log('ascii representation:', buf.subarray(idx, idx + 30).toString('ascii').replace(/[^\x20-\x7E]/g, '.'));
  idx += 4;
}
