const fs = require('fs');
const path = require('path');

const listingsPath = path.join(__dirname, 'src', 'components', 'MyListings.jsx');
let content = fs.readFileSync(listingsPath, 'utf8');

if (!content.includes('const getExpiryInfo')) {
  // Inject before the return statement using regex to handle whitespace/CRLF
  const returnRegex = /return\s*\(\s*<div className="space-y-6">/;
  
  const injection = `
  const handleRepost = async (id) => {
    if (!window.confirm('Repost this ad to reset its duration to 30 days and bump it to the top?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(\`\${API_BASE_URL}/api/listings/\${id}/repost\`, {
        method: 'POST',
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert('Listing reposted successfully! It has been moved to the top.');
        fetchMyListings();
      } else {
        throw new Error(data.error || 'Failed to repost listing');
      }
    } catch (err) {
      alert(err.message || 'Error reposting listing');
    }
  };

  const getExpiryInfo = (createdAt) => {
    const createdDate = new Date(createdAt);
    const expiryDate = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: 'Expired', color: 'text-rose-600', bg: 'bg-rose-50', dot: 'bg-rose-500' };
    if (daysLeft <= 5) return { text: \`\${daysLeft} days left\`, color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' };
    return { text: \`\${daysLeft} days left\`, color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' };
  };

  return (
    <div className="space-y-6">`;
    
  content = content.replace(returnRegex, injection);
  fs.writeFileSync(listingsPath, content, 'utf8');
  console.log("Injected missing functions into MyListings.jsx");
} else {
  console.log("Functions already exist.");
}
