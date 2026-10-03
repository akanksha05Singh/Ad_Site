const fs = require('fs');
let signup = fs.readFileSync('frontend/src/components/SignUpPage.jsx', 'utf8');

signup = signup.replace(/\{formData\.role === 'admin' && \([\s\S]*?<\/p>\s*\)\}/g, '');

fs.writeFileSync('frontend/src/components/SignUpPage.jsx', signup);
console.log('Removed warning!');
