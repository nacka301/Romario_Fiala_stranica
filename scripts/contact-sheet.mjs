import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
const root='source-images';const files=[];
for(const d of fs.readdirSync(root)){const p=path.join(root,d);if(fs.statSync(p).isDirectory())for(const f of fs.readdirSync(p))files.push(path.join(p,f));}
const T=240,cols=7;const rows=Math.ceil(files.length/cols);
const comps=[];let i=0;
for(const f of files){const m=await sharp(f).metadata();console.log(i,f.replace(root+'/',''),m.width+'x'+m.height,(fs.statSync(f).size/1024|0)+'KB');
const buf=await sharp(f).rotate().resize(T,T,{fit:'cover'}).toBuffer();
comps.push({input:buf,left:(i%cols)*T,top:Math.floor(i/cols)*T});
const lab=Buffer.from(`<svg width="60" height="30"><rect width="60" height="30" fill="black"/><text x="6" y="22" font-size="22" fill="white">${i}</text></svg>`);
comps.push({input:lab,left:(i%cols)*T,top:Math.floor(i/cols)*T});i++;}
await sharp({create:{width:cols*T,height:rows*T,channels:3,background:'#fff'}}).composite(comps).jpeg({quality:70}).toFile(process.argv[2]);
