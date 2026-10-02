const fs = require('fs');
const path = require('path');

const listingsPath = path.join(__dirname, 'src', 'components', 'MyListings.jsx');
let content = fs.readFileSync(listingsPath, 'utf8');

// 1. Add handleRepost and getExpiryInfo before the return statement
if (!content.includes('const handleRepost = async')) {
  const injectionPoint = '  return (\n    <div className="space-y-6">';
  const injectionContent = `  const handleRepost = async (id) => {
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
  content = content.replace(injectionPoint, injectionContent);
}

// 2. Change 'Status' table header to 'Status / Expiry'
content = content.replace(
  /<th className="px-6 py-4">Status<\/th>/,
  '<th className="px-6 py-4">Status / Expiry</th>'
);

// 3. Update the Status table cell
const oldStatusCellRegex = /<td className="px-6 py-4">\s*<span className="flex items-center gap-1\.5 text-emerald-600 font-normal text-sm uppercase tracking-wide">\s*<span className="h-1\.5 w-1\.5 rounded-full bg-emerald-500" \/>\s*Active\s*<\/span>\s*<\/td>/;

const newStatusCell = `<td className="px-6 py-4">
  {(() => {
    const expiry = getExpiryInfo(listing.createdAt);
    return (
      <span className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide \${expiry.color} \${expiry.bg}\`}>
        <span className={\`h-1.5 w-1.5 rounded-full \${expiry.dot}\`} />
        {expiry.text}
      </span>
    );
  })()}
</td>`;
content = content.replace(oldStatusCellRegex, newStatusCell);

// 4. Update the Actions table cell
const oldActionsCellRegex = /<td className="px-6 py-4 text-right space-x-2">/;
const newActionsCell = `<td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
  <button
    onClick={() => handleRepost(listing._id)}
    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
    title="Repost to bump to top and reset 30 days"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" /></svg>
    Repost
  </button>`;
content = content.replace(oldActionsCellRegex, newActionsCell);

fs.writeFileSync(listingsPath, content, 'utf8');
console.log("MyListings updated successfully.");
