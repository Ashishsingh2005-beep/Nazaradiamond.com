const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { mockUsers, mockProducts, mockOffers } = require('./config/mockData');

// Initialize Global Mock Database Arrays
global.isMongoConnected = false;
global.mockUsers = [...mockUsers];
global.mockProducts = [...mockProducts];
global.mockOffers = [
  {
    _id: 'offer_mock_1',
    name: 'Diwali Sale',
    discountValue: 20,
    startDate: new Date('2026-07-01'),
    endDate: new Date('2026-08-31'),
    applicableOn: 'All',
    status: 'Active'
  }
];
global.mockOrders = [];
global.mockCoupons = [
  {
    _id: 'coupon_mock_1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchaseAmount: 3000,
    expiryDate: new Date('2026-12-31'),
    isActive: true
  }
];
global.mockCategories = [
  { _id: 'cat_mock_1', name: 'Rings', subcategories: ['Solitaire', 'Band', 'Halo'] },
  { _id: 'cat_mock_2', name: 'Earrings', subcategories: ['Studs', 'Drops', 'Hoops'] },
  { _id: 'cat_mock_3', name: 'Necklaces', subcategories: ['Choker', 'Chains'] },
  { _id: 'cat_mock_4', name: 'Pendants', subcategories: ['Solitaire', 'Fancy'] },
  { _id: 'cat_mock_5', name: 'Bracelets & Bangles', subcategories: ['Tennis', 'Bangles'] },
  { _id: 'cat_mock_6', name: 'Mangalsutra', subcategories: ['Modern', 'Classic'] }
];
global.mockReviews = [
  {
    _id: 'rev_mock_1',
    user: 'user_mock_cust_id_002',
    userName: 'Anjali Gupta',
    product: 'prod_mock_baguette_001',
    rating: 5,
    comment: 'Absolutely breathtaking! The sparkle is indistinguishable from mined diamonds. The packaging was extremely premium and it arrived with an official certificate.',
    isApproved: true,
    createdAt: new Date()
  }
];
global.mockBanners = [
  {
    _id: 'banner_mock_1',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600',
    title: 'REAL DIAMONDS, ETHICALLY GROWN',
    buttonText: 'SHOP COLLECTION',
    buttonLink: '/products',
    type: 'slider',
    isActive: true
  }
];
global.mockWishlist = [];
global.mockCart = [];
global.mockAddresses = [];

// Route files
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const offerRoutes = require('./routes/offerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const couponRoutes = require('./routes/couponRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().then(() => {
  // Trigger database seeding
  seedDatabase();
});

const app = express();

// Body Parser Middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Nazara Diamonds E-Commerce API is running...');
});

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);

// Seed Initial Data (Only if MongoDB connects successfully)
const User = require('./models/User');
const Product = require('./models/Product');
const Offer = require('./models/Offer');

const seedDatabase = async () => {
  if (!global.isMongoConnected) return;
  try {
    // 1. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial users...');
      await User.create([
        {
          name: 'Nazara Admin',
          email: 'admin@nazaradiamonds.com',
          password: 'admin12345',
          role: 'admin'
        },
        {
          name: 'Regular Customer',
          email: 'user@nazaradiamonds.com',
          password: 'user12345',
          role: 'user'
        }
      ]);
      console.log('Initial users seeded.');
    }

    // 2. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding initial products...');
      await Product.create(mockProducts.map(p => {
        const { _id, ...rest } = p;
        return rest;
      }));
      console.log('Initial products seeded successfully.');
    }

    // 3. Seed Offers (Promotions)
    const offerCount = await Offer.countDocuments();
    if (offerCount === 0) {
      console.log('Seeding initial promotional offers...');
      await Offer.create(mockOffers.map(o => {
        const { _id, ...rest } = o;
        return rest;
      }));
      console.log('Initial offers seeded successfully.');
    }
  } catch (err) {
    console.error(`Database seeding failed: ${err.message}`);
  }
};


// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
