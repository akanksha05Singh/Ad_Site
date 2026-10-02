const fs = require('fs');
const path = require('path');

const profilePath = path.join(__dirname, 'src', 'components', 'UserProfile.jsx');
let content = fs.readFileSync(profilePath, 'utf8');

// 1. Add companyName state if missing
if (!content.includes('const [companyName, setCompanyName]')) {
  content = content.replace(
    /const \[fullName, setFullName\] = useState[^;]+;/,
    `$&
  const [companyName, setCompanyName] = useState(user?.companyName || '');`
  );
}

// 2. Remove websiteUrl from main profile form
const websiteUrlRegex = /\s*\{\/\*\s*Website URL\s*\*\/\}\s*<div className="space-y-1\.5">\s*<label[^>]*>Company \/ Personal Website<\/label>\s*<input[^>]*value=\{websiteUrl\}[^>]*\/>\s*<\/div>/;
content = content.replace(websiteUrlRegex, '');

// 3. Replace the placeholder for company/career tabs with actual forms
const placeholderRegex = /\) : workspaceTab === 'career' \|\| workspaceTab === 'company' \? \([\s\S]*?\) : \(/;

const newForms = `) : workspaceTab === 'company' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-outfit text-base font-medium text-slate-900">Company Information</h3>
              <p className="text-sm font-semibold text-slate-400 mt-0.5">Details for employers posting jobs</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Company Website</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '9999px',
                  border: '1.5px solid #000000',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  transition: 'background-color 0.18s ease, color 0.18s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#000000'; }}
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : workspaceTab === 'career' ? (
          <div className="p-8 text-center space-y-3">
            <svg className="w-10 h-10 text-slate-350 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-outfit font-medium text-slate-900 text-sm">Career Profile</h4>
              <p className="text-sm text-slate-450 mt-1 max-w-sm mx-auto">This section is for job seekers and is coming soon.</p>
            </div>
          </div>
        ) : (`;

content = content.replace(placeholderRegex, newForms);

// 4. Update the handleSubmit function to include companyName
content = content.replace(
  /website: websiteUrl,/,
  `website: websiteUrl,
      companyName: companyName,`
);

fs.writeFileSync(profilePath, content, 'utf8');
console.log("UserProfile updated successfully.");
