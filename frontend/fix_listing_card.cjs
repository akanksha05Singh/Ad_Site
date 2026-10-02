const fs = require('fs');
const path = require('path');

const cardPath = path.join(__dirname, 'src', 'components', 'ListingCard.jsx');
let cardContent = fs.readFileSync(cardPath, 'utf8');

// Replace flex col with row and wrap
cardContent = cardContent.replace(
  /<div className="flex flex-col gap-1\.5 text-sm">/g,
  '<div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2 text-sm">'
);

// Remove "Contact Information:" title
cardContent = cardContent.replace(
  /<div className="font-bold text-slate-800 mb-1">Contact Information:<\/div>/g,
  ''
);

// Optional: clean up website so it doesn't display https:// if it has it
cardContent = cardContent.replace(
  /<a href=\{companyWebsite\} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 hover:underline">\{companyWebsite\}<\/a>/g,
  '<a href={companyWebsite.startsWith("http") ? companyWebsite : `https://${companyWebsite}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 hover:underline">{companyWebsite.replace(/^https?:\\/\\//, "")}</a>'
);

fs.writeFileSync(cardPath, cardContent, 'utf8');
console.log("ListingCard.jsx updated successfully.");
