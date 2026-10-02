const fs = require('fs');
const path = require('path');

function replaceInFile(relativePath, searchRegex, replaceText) {
  const filePath = path.join(__dirname, relativePath);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(searchRegex, replaceText);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${relativePath}`);
}

// ListingCard.jsx
replaceInFile('src/components/ListingCard.jsx', /PA/g, 'per month');

// ListingModal.jsx
replaceInFile('src/components/ListingModal.jsx', /Salary \(PA\)/, 'Salary (per month)');

// JobFiltersSidebar.jsx
replaceInFile('src/components/JobFiltersSidebar.jsx', /Salary Range \(PA\)/, 'Salary Range (per month)');
