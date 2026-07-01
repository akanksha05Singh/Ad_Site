const sampleListings = [
  {
    title: "Senior Product Designer",
    description: "Lead product design initiatives at Razorpay. Collaborate with product managers and engineers to build intuitive payment checkout flows. Requires strong wireframing and interactive prototyping skills in Figma.",
    price: 3500000, // Matches LPA representation 28-42 Lakhs
    category: "job",
    location: "Bengaluru, KA",
    contactEmail: "recruitment@razorpay.com",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80",
    status: "active"
  },
  {
    title: "2023 BMW 3 Series 320d",
    description: "Mint condition BMW 3 Series. M-Sport package, leather interior, digital cockpit, diesel engine, automatic transmission, single owner, and only 18,000 km driven. Fully serviced at authorized dealer.",
    price: 4250000, // Matches 42,50,000 INR
    category: "classified",
    location: "Mumbai, MH",
    contactEmail: "owner.bmw@example.com",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
    status: "active"
  },
  {
    title: "3BHK Sea-View Apartment",
    description: "Premium sea-facing apartment located in the heart of Bandra West, Mumbai. Spans 1,450 sq ft of carpet area, offers modern amenities, 24/7 security, and 2 dedicated parking slots. Fully furnished.",
    price: 32000000, // Matches 3.2 Cr
    category: "classified",
    location: "Mumbai, MH",
    contactEmail: "realtor.bandra@example.com",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    status: "active"
  },
  {
    title: "Staff Software Engineer",
    description: "Architect and scale high-throughput core search engines at Swiggy. Solve complex microservices routing challenges, optimize query latency, and guide backend engineering teams. Requires strong Node/Java experience.",
    price: 6250000, // Matches LPA representation 50-75 Lakhs
    category: "job",
    location: "Hyderabad, TS",
    contactEmail: "careers@swiggy.in",
    imageUrl: "https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&w=600&q=80",
    status: "active"
  },
  {
    title: "Sony A7 IV Mirrorless Camera",
    description: "Comes with original packaging, battery, charger, and strap. Included lenses: Sony 24-70mm f/2.8 GM, Sony 50mm f/1.8, and Tamron 70-180mm f/2.8. Barely used, shutter count is less than 3,000.",
    price: 185000, // Matches 1,85,000 INR
    category: "classified",
    location: "Delhi NCR",
    contactEmail: "photographer.delhi@example.com",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    status: "active"
  }
];

async function seedDatabaseIfNeeded(Listing) {
  try {
    console.log('Force clearing database and seeding Figma-identical listings...');
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log('Successfully seeded database with 5 Figma-matching high-fidelity listings!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = { seedDatabaseIfNeeded };
