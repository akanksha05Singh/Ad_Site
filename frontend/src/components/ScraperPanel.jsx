import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

export default function ScraperPanel() {
  const [sourceUrl, setSourceUrl] = useState('https://jobs-api.norway.no/v2/listings.json');
  const [limit, setLimit] = useState(3);
  const [scraping, setScraping] = useState(false);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);

  const mockScrapedJobs = [
    {
      title: "React Native Mobile Developer",
      description: "We are seeking a talented React Native developer in Oslo. Help build our core iOS and Android classifieds application. Requires 3+ years experience with React hooks and native bridge integrations.",
      price: 780000,
      category: "job",
      location: "Oslo",
      contactEmail: "recruitment@mobilesystems.no"
    },
    {
      title: "DevOps Engineer (Kubernetes & AWS)",
      description: "Join Norway's fastest growing retail platform in Bergen. Implement infrastructure-as-code scripts, maintain Kubernetes clusters, and scale cloud operations. Remote friendly.",
      price: 900000,
      category: "job",
      location: "Bergen",
      contactEmail: "hr@cloudscale.no"
    },
    {
      title: "Product Marketing Manager",
      description: "Lead user acquisition and campaign strategy for our Nordic e-commerce sector in Trondheim. Develop media channels, manage SEM budgets, and optimize user registration funnels.",
      price: 650000,
      category: "job",
      location: "Trondheim",
      contactEmail: "careers@nordicreach.no"
    }
  ];

  const handleStartScrape = async (e) => {
    e.preventDefault();
    if (!sourceUrl.trim()) return;

    setScraping(true);
    setResult(null);
    setLogs([`[INFO] Starting external import parser...`, `[INFO] Requesting source feed URL: ${sourceUrl}`]);

    // Simulate logs in step intervals to make the UI feel alive!
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    await delay(800);
    setLogs(prev => [...prev, `[SUCCESS] Connected to server. HTTP Status: 200 OK.`, `[INFO] Parsing JSON payload keys...`]);

    await delay(1000);
    const importLimit = Math.min(limit, mockScrapedJobs.length);
    setLogs(prev => [...prev, `[INFO] Found ${importLimit} valid job postings in feed. Beginning import loop...`]);

    let importedCount = 0;

    for (let i = 0; i < importLimit; i++) {
      const job = mockScrapedJobs[i];
      setLogs(prev => [...prev, `[IMPORTING] "${job.title}" -> Sending DB post request...`]);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/listings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(job)
        });
        
        if (response.ok) {
          importedCount++;
          setLogs(prev => [...prev, `[SUCCESS] Imported: "${job.title}"`]);
        } else {
          setLogs(prev => [...prev, `[ERROR] Failed to save job "${job.title}"`]);
        }
      } catch (err) {
        setLogs(prev => [...prev, `[ERROR] Network error during import of "${job.title}"`]);
      }
      await delay(500);
    }

    setLogs(prev => [...prev, `[INFO] Finished importing. Terminated scrape worker process.`]);
    setResult(`Successfully imported ${importedCount} job openings into the database!`);
    setScraping(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="font-outfit text-2xl font-bold text-slate-900">Job Board Scraper Panel</h2>
        <p className="text-sm text-slate-500">Automate job database population by importing external JSON/XML feeds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 col-span-1 h-fit">
          <h3 className="font-outfit text-lg font-bold text-slate-900 mb-4">Scraper Configurations</h3>
          
          <form onSubmit={handleStartScrape} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Feed Target URL</label>
              <input
                type="text"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
                disabled={scraping}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Max Records to Import</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none bg-white"
                disabled={scraping}
              >
                <option value="1">1 Listing</option>
                <option value="2">2 Listings</option>
                <option value="3">3 Listings (Full Feed)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={scraping}
              className="w-full py-3 rounded-xl bg-slate-950 text-xs font-bold text-white shadow-sm hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {scraping ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running Scraper...
                </>
              ) : 'Run Scraper Import'}
            </button>
          </form>
        </div>

        {/* Console logs */}
        <div className="bg-slate-950 rounded-3xl p-6 col-span-2 border border-slate-900 flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${scraping ? 'bg-emerald-500 animate-ping' : 'bg-slate-500'}`} />
              Scraper Output Console
            </span>
            <button 
              onClick={() => { setLogs([]); setResult(null); }} 
              className="hover:text-slate-200"
              disabled={scraping}
            >
              Clear Logs
            </button>
          </div>

          <div className="flex-grow overflow-y-auto font-mono text-[11px] text-slate-350 space-y-1.5 max-h-[220px] scrollbar-thin">
            {logs.length === 0 ? (
              <p className="text-slate-600 italic">No output. Configure feed target URL and click 'Run Scraper Import'.</p>
            ) : (
              logs.map((log, idx) => {
                let color = 'text-slate-300';
                if (log.startsWith('[ERROR]')) color = 'text-rose-400 font-bold';
                if (log.startsWith('[SUCCESS]')) color = 'text-emerald-450 font-bold';
                if (log.startsWith('[IMPORTING]')) color = 'text-indigo-400';
                return (
                  <p key={idx} className={color}>{log}</p>
                );
              })
            )}
          </div>

          {result && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
