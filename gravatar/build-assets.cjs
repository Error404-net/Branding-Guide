// npm install --no-save puppeteer; node gravatar/build-assets.cjs
// All geometry comes from the existing canonical SVGs; no redrawn logo.
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');
const root = path.resolve(__dirname, '..');
const variants = [
  ['color', 'email-templates/hosted-images/signature-mark.svg', '#231451'],
  ['night', 'logos/monogram-night.svg', '#231451'],
  ['daylight', 'logos/monogram-daylight.svg', '#FFFFFF'],
];
function mark(file, x, y, size) {
  return fs.readFileSync(path.join(root, file), 'utf8').replace(/<metadata>[\s\S]*?<\/metadata>/g, '')
    .replace(/<svg[^>]*>/, `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 240 240">`);
}
function svg(w, h, body) { return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`; }
(async () => {
  const browser = await puppeteer.launch({headless:true});
  try {
    const page = await browser.newPage();
    async function exportImage(name, w, h, source) {
      fs.writeFileSync(path.join(__dirname, name + '.svg'), source);
      await page.setViewport({width:w,height:h,deviceScaleFactor:1});
      await page.setContent(`<style>html,body{margin:0;overflow:hidden}</style>${source}`);
      await page.screenshot({path:path.join(__dirname,name+'.png')});
    }
    for (const [name, file, bg] of variants) {
      await exportImage('avatar-'+name+'-1024',1024,1024,svg(1024,1024,
        `<rect width="1024" height="1024" fill="${bg}"/>`+mark(file,192,192,640)));
    }
    await exportImage('profile-background-1920x1080',1920,1080,svg(1920,1080,
      '<rect width="1920" height="1080" fill="#231451"/>'+mark(variants[0][1],1190,220,640)));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
