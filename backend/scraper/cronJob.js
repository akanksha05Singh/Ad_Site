const cron = require('node-cron');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const ScraperSource = require('../models/ScraperSource');
const Listing = require('../models/Listing');

async function scrapeJobBoard(url) {
  try {
    console.log(`Starting scrape for URL: ${url}`);
    
    // Fetch HTML directly to bypass all Chrome/Puppeteer AWS limits
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      // 30 second timeout
      signal: AbortSignal.timeout(30000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    
    const $ = cheerio.load(content);
    
    // Generic scraping logic - will attempt to extract based on common HTML classes/tags
    const jobs = [];
    
    // Try to find generic job listing wrappers
    // Many job boards use these class names
    const selectors = [
      '.srp-jobtuple-wrapper', '.cust-job-tuple', '.jobTuple', '.employer-block', '.job-row',
      '.job-listing', '.job-card', '.listing-item', '.result-card', 
      '.search-result', 'li.job', '.card', 'article'
    ];
    
    let matchedSelector = null;
    for (const selector of selectors) {
      if ($(selector).length > 0) {
        matchedSelector = selector;
        break;
      }
    }
    
    if (matchedSelector) {
      $(matchedSelector).each((i, el) => {
        // Extract Title
        const title = $(el).find('h2, h3, .job-title, .title').first().text().trim();
        
        // Extract Company/Description
        const company = $(el).find('.company, .employer, .comp-name, .company-name, h4, a.comp-name').first().text().trim() || 'Unknown Company';
        const descSnippet = $(el).find('.description, .job-desc, .summary, p, .job-description').first().text().trim() || 'Details available on the original job posting.';
        
        // Extract Location
        const location = $(el).find('.location, .loc, .locWdth, .job-location').first().text().trim() || 'Not Specified';
        
        // Link to original (sometimes relative)
        let link = $(el).find('a').first().attr('href');
        if (link && !link.startsWith('http')) {
          const baseUrl = new URL(url).origin;
          link = `${baseUrl}${link}`;
        }
        
        // Extract Image (Company Logo)
        let imageUrl = $(el).find('img').first().attr('src') || '';
        if (imageUrl && !imageUrl.startsWith('http')) {
          const baseUrl = new URL(url).origin;
          imageUrl = `${baseUrl}${imageUrl}`;
        }

        // Try to extract Salary Range from text, otherwise 0
        let minPrice = 0;
        let maxPrice = 0;
        const allText = $(el).text().replace(/,/g, '');
        // Generic regex looking for patterns like 100000 - 150000 or 100k - 150k
        const salaryMatch = allText.match(/(?:Rs\.?|₹|\$|€|£)?\s*(\d{2,3})(?:k|,\d{3})\s*[-to]+\s*(?:Rs\.?|₹|\$|€|£)?\s*(\d{2,3})(?:k|,\d{3})/i);
        if (salaryMatch) {
           let minExtracted = parseInt(salaryMatch[1], 10);
           let maxExtracted = parseInt(salaryMatch[2], 10);
           // Convert k to thousands
           if (minExtracted < 1000) minExtracted *= 1000;
           if (maxExtracted < 1000) maxExtracted *= 1000;
           
           if (minExtracted > 0 && maxExtracted > minExtracted) {
             minPrice = minExtracted;
             maxPrice = maxExtracted;
           }
        }
        
        if (title && title.length > 3) {
          jobs.push({
            title: title,
            description: `${company ? `Company: ${company}\n\n` : ''}${descSnippet}`,
            price: minPrice,
            maxPrice: maxPrice,
            imageUrl: imageUrl,
            originalLink: link || url,
            isScraped: true,
            category: 'job',
            location: location,
            companyName: company || 'Not Specified',
            contactEmail: 'not-provided@scraped.local',
            state: 'Not Specified',
            employmentType: 'Not Specified',
            workFromHome: location.toLowerCase().includes('remote') || location.toLowerCase().includes('home'),
            status: 'pending' // Send scraped jobs to the Review Queue first
          });
        }
      });
    } else {
      console.log('Could not identify a common list container on the page.');
    }
    
    return jobs;
  } catch (err) {
    console.error(`Error scraping ${url}:`, err);
    return [];
  }
}

async function runScraperTask() {
  console.log('--- CRON JOB TRIGGERED: Running automated scrapers ---');
  try {
    const sources = await ScraperSource.find({ status: 'active' });
    console.log(`Found ${sources.length} active sources.`);
    
    for (const source of sources) {
      let scrapedJobs = await scrapeJobBoard(source.url);
      
      console.log(`Successfully extracted ${scrapedJobs.length} jobs from ${source.url}`);
      
      // Real scraped jobs only. Removed demo fallback logic.

      
      let insertedCount = 0;
      
      for (const jobData of scrapedJobs) {
        // Simple deduplication - check if a job with this exact title exists
        const existing = await Listing.findOne({ title: jobData.title, category: 'job' });
        
        if (!existing) {
          const newListing = new Listing(jobData);
          await newListing.save();
          insertedCount++;
        }
      }
      
      console.log(`Saved ${insertedCount} new listings to DB.`);
      
      // Update Source status
      source.lastScrapedAt = new Date();
      source.jobsFound += insertedCount;
      await source.save();
    }
    console.log('--- CRON JOB COMPLETED ---');
  } catch (error) {
    console.error('Error in scraper cron job:', error);
  }
}

// Schedule task to run every day at Midnight
cron.schedule('0 0 * * *', runScraperTask, {
  scheduled: true,
  timezone: "UTC"
});

module.exports = {
  runScraperTask, // Exporting for manual trigger capability
  scrapeJobBoard // Exporting for direct scraping endpoint
};
