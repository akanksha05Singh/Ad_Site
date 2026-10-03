const fs = require('fs');
let landing = fs.readFileSync('frontend/src/components/LandingPage.jsx', 'utf8');

landing = landing.replace(/\/\* ── 4\. Analytics Strip ── \*\/[\s\S]*?\{\/\* ── 5\. Featured Listings ── \*\/\}/g, '{/* ── 5. Featured Listings ── */}');

fs.writeFileSync('frontend/src/components/LandingPage.jsx', landing);
console.log('Removed Analytics strip!');
