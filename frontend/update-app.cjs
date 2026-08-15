const fs = require('fs');
const file = 'c:/Users/akume/OneDrive/Desktop/FreeAds/freeads-mvp/frontend/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const newContent = `            {/* ── 2. Hero Section ── */}
            <section style={{
              maxWidth: '1180px', margin: '0 auto', padding: '1rem 0 2.5rem', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap'
            }}>
              <div style={{ flex: '1 1 340px', maxWidth: '520px' }}>
                <h1 style={{
                  fontFamily: 'Outfit, Inter, sans-serif', fontSize: 'clamp(2rem, 4vw, 2.875rem)',
                  fontWeight: 400, lineHeight: 1.18, color: '#000000', margin: 0, marginBottom: '1rem'
                }}>
                  exciting <span style={{ fontWeight: 700, color: '#f05a28' }}>job opportunities</span> near you
                </h1>
                <p style={{ fontSize: '0.9375rem', fontWeight: 400, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
                  1000s of new jobs updated daily
                </p>
              </div>
              <div style={{ flex: '1 1 300px', maxWidth: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/landing-hero.png" alt="Team working on exciting job opportunities" style={{ width: '100%', maxWidth: '440px', height: 'auto', display: 'block' }} />
              </div>
            </section>

            {/* ── 3. JOB Category Pill (only category shown) ── */}
            <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '0.5rem 0 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fed7aa' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f05a28" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><path d="M12 12v4"/><path d="M8 12h8"/>
                  </svg>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#000000', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  JOBS
                </span>
              </div>
            </section>

            {/* ── 4. Analytics Counter Strip ── */}
            <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '1rem 0 2.5rem' }}>
              <div style={{ display: 'flex', gap: '0', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                {[
                  { value: '2.4 M+', label: 'Registered users' },
                  { value: '2,450',  label: 'Active Listing' },
                  { value: '3,470',  label: 'Companies Hiring' },
                ].map((stat, i) => (
                  <div key={i} style={{
                    flex: 1, padding: '1.25rem 1.5rem', borderRight: i < 2 ? '1px solid #e5e7eb' : 'none',
                    textAlign: 'center', backgroundColor: '#ffffff'
                  }}>
                    <p style={{ fontWeight: 700, fontSize: '1.25rem', color: '#000000', margin: 0, fontFamily: 'Outfit, Inter, sans-serif' }}>
                      {stat.value}
                    </p>
                    <p style={{ fontWeight: 400, fontSize: '0.8125rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>`;

const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('{/* Slogan Pill & Slogan Title */}'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('{/* Featured Listings Feed Container */}'));

if (startIdx !== -1 && endIdx !== -1) {
  lines.splice(startIdx, endIdx - startIdx, newContent);
  content = lines.join('\n');
  content = content.replace('showSearch={true} // Search is always visible in the header in all views!', "showSearch={activeTab !== 'feed'} // Search is completely removed from the home feed");
  fs.writeFileSync(file, content);
  console.log('Successfully updated App.jsx logged-in feed view');
} else {
  console.log('Error: Could not find start or end index', startIdx, endIdx);
}
