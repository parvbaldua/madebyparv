import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const gitExe = 'C:\\Users\\parvb\\AppData\\Local\\GitHubDesktop\\app-3.5.9-beta3\\resources\\app\\git\\cmd\\git.exe';
const targetPath = path.join(process.cwd(), 'public', 'hero-video.mp4');

console.log('Extracting original binary MP4 from git commit 630fc63...');
const buffer = execSync(`"${gitExe}" show 630fc63:public/hero-video.mp4`, {
  maxBuffer: 50 * 1024 * 1024,
  encoding: 'buffer'
});

fs.writeFileSync(targetPath, buffer);
console.log('Successfully wrote exact binary video:', buffer.length, 'bytes');
