const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const Product = require('./models/Product');

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not defined in .env');
    }
    
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');
    
    // Read scraped products JSON from scratch directory
    const jsonPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\12542eaf-d836-49e1-9e1f-0c0f55f6feba\\scratch\\scraped_products.json';
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`scraped_products.json not found at ${jsonPath}`);
    }
    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Loaded ${productsData.length} products from JSON.`);
    
    // Clear existing products
    console.log('Clearing existing products in DB...');
    const deleteResult = await Product.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} products.`);
    
    // Prepare documents (strip custom string _id to let MongoDB auto-generate ObjectIds)
    const docs = productsData.map(p => {
      const { _id, ...rest } = p;
      return rest;
    });
    
    // Insert new products
    console.log('Inserting new products...');
    const insertResult = await Product.insertMany(docs);
    console.log(`Successfully inserted ${insertResult.length} products into the database.`);
    
    // Verify count
    const count = await Product.countDocuments();
    console.log(`Verification: Total products in DB is now ${count}`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (err) {
    console.error('Import failed:', err);
    process.exit(1);
  }
}

run();
