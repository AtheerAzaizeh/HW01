import express from 'express';

const router = express.Router();

// Sample hoodie data with proper structure for frontend
const SAMPLE_HOODIES = [
  {
    id: 'ext-001',
    title: "Classic Black Hoodie",
    description: "Premium cotton blend hoodie in timeless black. Features a kangaroo pocket and adjustable drawstring hood for ultimate comfort.",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"],
    price: 49.99,
    source: "Fashion",
    category: { name: "Hoodies" }
  },
  {
    id: 'ext-002',
    title: "Oversized Gray Hoodie",
    description: "Relaxed fit oversized hoodie in heather gray. Perfect for layering or wearing solo for that streetwear look.",
    images: ["https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400"],
    price: 59.99,
    source: "Fashion",
    category: { name: "Hoodies" }
  },
  {
    id: 'ext-003',
    title: "Streetwear Logo Hoodie",
    description: "Bold streetwear hoodie with minimalist branding. Made from heavyweight cotton for durability and style.",
    images: ["https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=400"],
    price: 69.99,
    source: "Streetwear",
    category: { name: "Hoodies" }
  },
  {
    id: 'ext-004',
    title: "Minimal White Hoodie",
    description: "Clean and crisp white hoodie with a modern minimalist design. Essential wardrobe staple for any season.",
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400"],
    price: 54.99,
    source: "Fashion",
    category: { name: "Hoodies" }
  },
  {
    id: 'ext-005',
    title: "Vintage Wash Hoodie",
    description: "Pre-washed hoodie with vintage distressed look. Soft and broken-in feel from day one.",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400"],
    price: 79.99,
    source: "Vintage",
    category: { name: "Hoodies" }
  },
  {
    id: 'ext-006',
    title: "Zip-Up Black Hoodie",
    description: "Full-zip hoodie in classic black. Features metal zipper and side pockets for everyday functionality.",
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"],
    price: 64.99,
    source: "Fashion",
    category: { name: "Hoodies" }
  },
  {
    id: 'ext-007',
    title: "Premium Fleece Hoodie",
    description: "Ultra-soft fleece-lined hoodie for maximum warmth. Premium quality materials for lasting comfort.",
    images: ["https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400"],
    price: 89.99,
    source: "Premium",
    category: { name: "Hoodies" }
  },
  {
    id: 'ext-008',
    title: "Urban Tech Hoodie",
    description: "Technical hoodie with moisture-wicking fabric. Perfect for active lifestyles and urban exploration.",
    images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400"],
    price: 74.99,
    source: "Streetwear",
    category: { name: "Hoodies" }
  },
  {
    id: 'ext-009',
    title: "Cropped Hoodie",
    description: "Trendy cropped hoodie with relaxed fit. Great for high-waisted pants and layered outfits.",
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400"],
    price: 44.99,
    source: "Fashion",
    category: { name: "Hoodies" }
  },
  {
    id: 'ext-010',
    title: "Dark Mode Hoodie",
    description: "Sleek dark hoodie for the modern minimalist. Features a subtle tonal design and premium finish.",
    images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400"],
    price: 59.99,
    source: "Fashion",
    category: { name: "Hoodies" }
  },
  {
    id: 'ext-011',
    title: "Essentials Hoodie",
    description: "Your everyday essential hoodie. Simple, comfortable, and versatile for any occasion.",
    images: ["https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400"],
    price: 49.99,
    source: "Essentials",
    category: { name: "Hoodies" }
  },
  {
    id: 'ext-012',
    title: "Athletic Fit Hoodie",
    description: "Performance hoodie with athletic cut. Designed for workouts and casual wear alike.",
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400"],
    price: 69.99,
    source: "Athletic",
    category: { name: "Hoodies" }
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
