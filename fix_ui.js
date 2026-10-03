const fs = require('fs');

// 1. Remove the global font-size from index.css
let css = fs.readFileSync('frontend/src/index.css', 'utf8');
css = css.replace(/\/\* Maintain all fonts in same size per user request, but allow bolding \*\/[\s\S]*?font-size: 15px !important;\s*\}/g, '');
fs.writeFileSync('frontend/src/index.css', css);

// 2. Remove any borders from LandingPage header
let landing = fs.readFileSync('frontend/src/components/LandingPage.jsx', 'utf8');
landing = landing.replace(/borderBottom: '0',/g, "border: 'none', borderBottom: 'none',");
fs.writeFileSync('frontend/src/components/LandingPage.jsx', landing);

console.log('Final UI fixes complete!');
