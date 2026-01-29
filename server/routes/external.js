import express from 'express';

const router = express.Router();

// Sample hoodie data (previously scraped, now static for reliability)
const SAMPLE_HOODIES = [
  {
    title: "Classic Black Hoodie",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    price: 49.99,
    source: "Fashion"
  },
  {
    title: "Oversized Gray Hoodie",
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400",
    price: 59.99,
    source: "Fashion"
  },
  {
    title: "Streetwear Logo Hoodie",
    image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=400",
    price: 69.99,
    source: "Streetwear"
  },
  {
    title: "Minimal White Hoodie",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400",
    price: 54.99,
    source: "Fashion"
  },
  {
    title: "Vintage Wash Hoodie",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
    price: 79.99,
    source: "Vintage"
  },
  {
    title: "Zip-Up Black Hoodie",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    price: 64.99,
    source: "Fashion"
  },
  {
    title: "Premium Fleece Hoodie",
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400",
    price: 89.99,
    source: "Premium"
  },
  {
    title: "Urban Tech Hoodie",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400",
    price: 74.99,
    source: "Streetwear"
  },
  {
    title: "Cropped Hoodie",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
    price: 44.99,
    source: "Fashion"
  },
  {
    title: "Dark Mode Hoodie",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400",
    price: 59.99,
    source: "Fashion"
  },
  {
    title: "Essentials Hoodie",
    image: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400",
    price: 49.99,
    source: "Essentials"
  },
  {
    title: "Athletic Fit Hoodie",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
    price: 69.99,
    source: "Athletic"
  }
];

// @desc    Get external hoodie data (static sample data)
// @route   GET /api/external/scrape
// @access  Public
router.get('/scrape', (req, res) => {
  // Return static sample data with slight randomization
  const shuffled = [...SAMPLE_HOODIES].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10);
  
  res.status(200).json({
    success: true,
    count: selected.length,
    data: selected,
    note: 'Sample hoodie data from curated collection'
  });
});

// @desc    Get weather data (mock)
// @route   GET /api/external/weather
// @access  Public
router.get('/weather', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      location: 'New York, NY',
      temperature: Math.floor(Math.random() * 30) + 10,
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Windy'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 40) + 40,
      note: 'Perfect hoodie weather!'
    }
  });
});

// @desc    Get currency rates (mock)
// @route   GET /api/external/currencies
// @access  Public
router.get('/currencies', (req, res) => {
  res.status(200).json({
    success: true,
    base: 'USD',
    data: {
      EUR: 0.92,
      GBP: 0.79,
      ILS: 3.65,
      JPY: 149.50,
      CAD: 1.36
    }
  });
});

// @desc    Get GitHub info (mock)
// @route   GET /api/external/github
// @access  Public
router.get('/github', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      repo: 'blakv-hoodie-store',
      stars: 42,
      forks: 12,
      language: 'JavaScript',
      description: 'Premium hoodie e-commerce store'
    }
  });
});

export default router;
