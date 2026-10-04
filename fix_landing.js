const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/LandingPage.jsx', 'utf8');

// Using basic string replacements to avoid regex escaping hell and newline issues
content = content.replace("fontSize: 'clamp(2rem, 4vw, 3rem)'", "fontSize: 'clamp(3rem, 6vw, 4.5rem)'");
content = content.replace("fontSize: '1.25rem'", "fontSize: '0.875rem'");
content = content.replace("transform: 'scale(1.25)'", "transform: 'scale(1.4)'");

// For the icon size/gap
content = content.replace("gap: '0.75rem'", "gap: '0.5rem'");
content = content.replace("width: '40px', height: '40px'", "width: '32px', height: '32px'");
content = content.replace("borderRadius: '12px'", "borderRadius: '10px'");
content = content.replace('width="20" height="20"', 'width="16" height="16"');
content = content.replace("fontSize: '1rem'", "fontSize: '0.75rem'");

fs.writeFileSync('frontend/src/components/LandingPage.jsx', content);
console.log('Successfully updated LandingPage!');
