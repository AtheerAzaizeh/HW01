// server/seed.js
// Run: npm run seed
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const users = [
  {
    name: 'Super Admin',
    email: 'superadmin@blakv.com',
    password: 'superadmin123',
    role: 'superadmin'
  },
  {
    name: 'Admin User',
    email: 'admin@blakv.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  }
];

const products = [
  {
    name: 'ESSENTIALS Black Hoodie',
    description: 'Heavyweight cotton hoodie with an oversized fit. Perfect for layering or wearing solo. Features a kangaroo pocket and adjustable drawstring hood.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
    category: 'pullover',
    stock: 50,
    featured: true
  },
  {
    name: 'Oversized Concrete Grey',
    description: 'Street-ready oversized hoodie in concrete grey. Made from premium fleece for maximum comfort and durability.',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=800&q=80',
    category: 'oversized',
    stock: 35,
    featured: true
  },
  {
    name: 'Midnight Black Zip-Up',
    description: 'Full-zip hoodie in midnight black. Features a sleek design with premium YKK zipper and ribbed cuffs.',
    price: 110.00,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    category: 'zip-up',
    stock: 28,
    featured: true
  },
  {
    name: 'Classic Navy Pullover',
    description: 'Timeless navy pullover with fleece lining. Features a spacious kangaroo pocket and reinforced seams.',
    price: 85.00,
    image: 'https://images.unsplash.com/photo-1542327897-4141b355e20e?auto=format&fit=crop&w=800&q=80',
    category: 'pullover',
    stock: 42,
    featured: false
  },
  {
    name: 'Cream Sherpa Hoodie',
    description: 'Luxurious sherpa-lined hoodie in cream. The ultimate winter essential with ultra-soft interior.',
    price: 145.00,
    image: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=800&q=80',
    category: 'premium',
    stock: 20,
    featured: true
  },
  {
    name: 'Forest Green Pullover',
    description: 'Eco-friendly organic cotton hoodie in forest green. Relaxed fit with a soft, lived-in feel.',
    price: 99.00,
    image: 'https://images.unsplash.com/photo-1614975059251-992f11792571?auto=format&fit=crop&w=800&q=80',
    category: 'pullover',
    stock: 30,
    featured: false
  },
  {
    name: 'Charcoal Tech Fleece',
    description: 'Athletic-cut tech fleece hoodie. Features moisture-wicking fabric and zippered pockets.',
    price: 125.00,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    category: 'premium',
    stock: 25,
    featured: false
  },
  {
    name: 'Vintage Wash Hoodie',
    description: 'Pre-washed for that vintage look and feel. Soft, broken-in comfort from day one.',
    price: 79.00,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    category: 'pullover',
    stock: 40,
    featured: false
  },
  {
    name: 'Limited Edition Gold Accent',
    description: 'Exclusive limited edition hoodie with gold embroidered accents. Only 100 pieces made worldwide.',
    price: 199.00,
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=800&q=80',
    category: 'limited',
    stock: 10,
    featured: false
  },
  {
    name: 'Burgundy Essential',
    description: 'Deep burgundy pullover hoodie. A sophisticated take on the classic streetwear staple.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1565978190380-52f0988ba7a2?auto=format&fit=crop&w=800&q=80',
    category: 'pullover',
    stock: 45,
    featured: false
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users (password hashing is handled by the model)
    const createdUsers = await User.create(users);
    console.log(`👤 Created ${createdUsers.length} users`);

    // Create products
    const createdProducts = await Product.create(products);
    console.log(`🎽 Created ${createdProducts.length} products`);

    console.log(`
╔═════════════════════════════════════════════════╗
║         ✅ Database Seeded Successfully!        ║
╠═════════════════════════════════════════════════╣
║  SUPER ADMIN (Full Control):                    ║
║  Email: superadmin@blakv.com                    ║
║  Password: superadmin123                        ║
╠═════════════════════════════════════════════════╣
║  ADMIN (Products/Orders/Chat):                  ║
║  Email: admin@blakv.com                         ║
║  Password: admin123                             ║
╠═════════════════════════════════════════════════╣
║  USER:                                          ║
║  Email: john@example.com                        ║
║  Password: password123                          ║
╚═════════════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    process.exit(1);
  }
};

seedDB();
