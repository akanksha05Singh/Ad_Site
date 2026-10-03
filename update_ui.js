const fs = require('fs');

// Update LandingPage.jsx
let landing = fs.readFileSync('frontend/src/components/LandingPage.jsx', 'utf8');

landing = landing.replace(/fontSize: 'clamp\\(2rem, 4vw, 3rem\\)'/g, "fontSize: 'clamp(3rem, 6vw, 4.5rem)'");
landing = landing.replace(/fontSize: '1\\.25rem'/g, "fontSize: '0.875rem'");
landing = landing.replace(/transform: 'scale\\(1\\.25\\)'/g, "transform: 'scale(1.4)'");
landing = landing.replace(/gap: '0\\.75rem'/g, "gap: '0.5rem'");
landing = landing.replace(/width: '40px', height: '40px'/g, "width: '32px', height: '32px'");
landing = landing.replace(/borderRadius: '12px'/g, "borderRadius: '10px'");
landing = landing.replace(/width=\"20\" height=\"20\"/g, 'width=\"16\" height=\"16\"');
landing = landing.replace(/fontSize: '1rem'/g, "fontSize: '0.75rem'");

fs.writeFileSync('frontend/src/components/LandingPage.jsx', landing);

// Update Footer.jsx
let footer = fs.readFileSync('frontend/src/components/Footer.jsx', 'utf8');

footer = footer.replace(/gap-1/g, 'gap-0');
footer = footer.replace(/mt-1/g, 'mt-0.5');
footer = footer.replace(/mb-1/g, 'mb-0');
footer = footer.replace(/mt-2/g, 'mt-1');
footer = footer.replace(/font-bold text-slate-900/g, 'font-extrabold text-black');

fs.writeFileSync('frontend/src/components/Footer.jsx', footer);

console.log('UI Updates completed!');
