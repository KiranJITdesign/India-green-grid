import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.resolve(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('./app').concat(walk('./components')).concat(walk('./data'));
const regex = /https?:\/\/[^\s"'`]+/g;

const found = {};
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const url = match[0].replace(/[,\);]+$/, '');
    if (!found[url]) found[url] = [];
    found[url].push(path.relative('.', f).replace(/\\/g, '/'));
  }
}

console.log(JSON.stringify(found, null, 2));
