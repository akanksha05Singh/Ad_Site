const sampleListings = [
  {
    title: "Graphic Designer",
    companyName: "TCS",
    location: "Bangalore",
    description: "Looking for an experienced Graphic Designer to join TCS Bangalore. Proficiency in Figma, Adobe Creative Cloud, and digital illustration required.",
    price: 650000,
    category: "job",
    isFeatured: true,
    contactEmail: "careers@tcs.com",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
  },
  {
    title: "Graphic Designer",
    companyName: "TCS",
    location: "Bangalore",
    description: "Creative Graphic Designer needed for digital marketing materials and product branding.",
    price: 600000,
    category: "job",
    isFeatured: true,
    contactEmail: "careers@tcs.com",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hr ago
  },
  {
    title: "Graphic Designer",
    companyName: "TCS",
    location: "Bangalore",
    description: "Visual & UI Graphic Designer position for web and mobile interfaces.",
    price: 700000,
    category: "job",
    isFeatured: true,
    contactEmail: "careers@tcs.com",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 90)
  },
  {
    title: "Graphic Designer",
    companyName: "TCS",
    location: "Bangalore",
    description: "Graphic Designer role focusing on brand identity, typography, and presentations.",
    price: 620000,
    category: "job",
    isFeatured: true,
    contactEmail: "careers@tcs.com",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 120)
  },
  {
    title: "Graphic Designer",
    companyName: "TCS",
    location: "Bangalore",
    description: "Join the TCS design studio in Bangalore working with multinational clients.",
    price: 680000,
    category: "job",
    isFeatured: true,
    contactEmail: "careers@tcs.com",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 150)
  },
  {
    title: "Graphic Designer",
    companyName: "TCS",
    location: "Bangalore",
    description: "Senior Graphic Designer responsible for conceptualizing creative assets.",
    price: 750000,
    category: "job",
    isFeatured: true,
    contactEmail: "careers@tcs.com",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 180)
  },
  {
    title: "Graphic Designer",
    companyName: "TCS",
    location: "Bangalore",
    description: "Graphic Designer needed with strong layout, vector graphics, and color theory skills.",
    price: 640000,
    category: "job",
    isFeatured: true,
    contactEmail: "careers@tcs.com",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 210)
  },
  {
    title: "Graphic Designer",
    companyName: "TCS",
    location: "Bangalore",
    description: "Graphic Designer with experience in brand guidelines, social media assets, and vector art.",
    price: 660000,
    category: "job",
    isFeatured: true,
    contactEmail: "careers@tcs.com",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 240)
  }
];

async function seedDatabaseIfNeeded(Listing) {
  try {
    const featuredCount = await Listing.countDocuments({ isFeatured: true });
    if (featuredCount === 0) {
      console.log('Seeding initial featured listings...');
      await Listing.insertMany(sampleListings);
      console.log('Successfully seeded database with featured listings!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = { seedDatabaseIfNeeded, sampleListings };
