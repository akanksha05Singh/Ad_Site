const fs = require('fs');
const path = require('path');

// --- ListingModal.jsx ---
const modalPath = path.join(__dirname, 'src', 'components', 'ListingModal.jsx');
let modalContent = fs.readFileSync(modalPath, 'utf8');

// 1. Label font sizes: change text-xs to text-sm
modalContent = modalContent.replace(/text-xs font-bold/g, 'text-sm font-bold');

// 2. Remove the word "Range" from Salary Range (if any). Let's just make sure.
modalContent = modalContent.replace(/Salary Range/ig, 'Salary');

// 3. Validation: Max must be > Min
const validationInjection = `
  if (formData.category === 'job' && parsedMaxPrice > 0 && parsedMaxPrice <= parsedMinPrice) {
    return setError('Maximum salary must be greater than minimum salary');
  }
`;
if (!modalContent.includes('Maximum salary must be greater than minimum salary')) {
  modalContent = modalContent.replace(
    /if \(!formData\.location\.trim\(\)\)/,
    match => validationInjection + '\n  ' + match
  );
}

fs.writeFileSync(modalPath, modalContent, 'utf8');


// --- JobFiltersSidebar.jsx ---
const filtersPath = path.join(__dirname, 'src', 'components', 'JobFiltersSidebar.jsx');
let filtersContent = fs.readFileSync(filtersPath, 'utf8');

// 1. Remove the word "Range"
filtersContent = filtersContent.replace(/Salary Range/ig, 'Salary');

fs.writeFileSync(filtersPath, filtersContent, 'utf8');


// --- UserProfile.jsx ---
const profilePath = path.join(__dirname, 'src', 'components', 'UserProfile.jsx');
let profileContent = fs.readFileSync(profilePath, 'utf8');

// 1. Expandable textarea for "About Me"
// Currently it might have 'resize-none'. Change to 'resize-y'
profileContent = profileContent.replace(/resize-none/g, 'resize-y');

fs.writeFileSync(profilePath, profileContent, 'utf8');

console.log("All updates complete!");
