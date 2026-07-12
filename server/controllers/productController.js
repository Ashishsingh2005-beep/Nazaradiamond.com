const Product = require('../models/Product');
const Offer = require('../models/Offer');

// Helper to append applicable offer to products
const getApplicableOffer = async (product) => {
  try {
    const currentDate = new Date();
    let activeOffers = [];

    if (!global.isMongoConnected) {
      activeOffers = global.mockOffers.filter(
        (o) =>
          o.status === 'Active' &&
          currentDate >= new Date(o.startDate) &&
          currentDate <= new Date(o.endDate)
      );
    } else {
      activeOffers = await Offer.find({
        status: 'Active',
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
      });
    }

    let bestOffer = null;

    for (const offer of activeOffers) {
      let isApplicable = false;

      if (offer.applicableOn === 'All') {
        isApplicable = true;
      } else if (offer.applicableOn === 'Category' && offer.applicableCategory) {
        if (product.category && product.category.toLowerCase() === offer.applicableCategory.toLowerCase()) {
          isApplicable = true;
        }
      } else if (offer.applicableOn === 'Product' && offer.applicableProducts) {
        if (global.isMongoConnected) {
          isApplicable = offer.applicableProducts.some(
            (id) => id.toString() === product._id.toString()
          );
        } else {
          isApplicable = offer.applicableProducts.some(
            (id) => String(id) === String(product._id)
          );
        }
      }

      if (isApplicable) {
        const currentOfferType = offer.discountType || 'percentage';
        const currentOfferAmt = currentOfferType === 'percentage'
          ? (product.basePrice * offer.discountValue) / 100
          : offer.discountValue;

        const bestOfferType = bestOffer ? (bestOffer.discountType || 'percentage') : 'percentage';
        const bestOfferAmt = bestOffer
          ? (bestOfferType === 'percentage'
              ? (product.basePrice * bestOffer.discountValue) / 100
              : bestOffer.discountValue)
          : 0;

        if (!bestOffer || currentOfferAmt > bestOfferAmt) {
          bestOffer = offer;
        }
      }
    }

    return bestOffer
      ? { 
          name: bestOffer.name, 
          discountValue: bestOffer.discountValue,
          discountType: bestOffer.discountType || 'percentage'
        }
      : null;
  } catch (err) {
    console.error('Error calculating applicable offer:', err);
    return null;
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { category, search, metal } = req.query;

  try {
    let products = [];

    if (!global.isMongoConnected) {
      let filtered = [...global.mockProducts];

      if (category) {
        filtered = filtered.filter((p) => p.category === category);
      }

      if (search) {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
        );
      }

      if (metal) {
        filtered = filtered.filter((p) => p.variations.metals.includes(metal));
      }

      // Sort by newest first
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      products = filtered.map(p => ({ ...p }));
    } else {
      let query = {};

      if (category) {
        query.category = category;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      if (metal) {
        query['variations.metals'] = metal;
      }

      const dbProducts = await Product.find(query).sort({ createdAt: -1 });
      products = dbProducts.map(p => p.toObject());
    }

    // Attach active offers
    for (let product of products) {
      product.applicableOffer = await getApplicableOffer(product);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    let product = null;

    if (!global.isMongoConnected) {
      const mockProduct = global.mockProducts.find((p) => p._id === req.params.id);
      if (mockProduct) {
        product = { ...mockProduct };
      }
    } else {
      const dbProduct = await Product.findById(req.params.id);
      if (dbProduct) {
        product = dbProduct.toObject();
      }
    }

    if (product) {
      product.applicableOffer = await getApplicableOffer(product);
      return res.json(product);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const {
    name,
    description,
    basePrice,
    discountPrice,
    category,
    subcategory,
    images,
    specifications,
    variations,
    inventory,
    weight,
    tags,
    status
  } = req.body;

  try {
    if (!global.isMongoConnected) {
      const newProduct = {
        _id: `prod_mock_${Math.random().toString(36).substring(2, 11)}`,
        name,
        description,
        basePrice: Number(basePrice),
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        category,
        subcategory: subcategory || '',
        images: images || ['https://res.cloudinary.com/demo/image/upload/v1311284707/sample.jpg'],
        specifications: specifications || { diamondColor: 'D-E-F', diamondQuality: 'VVS-VS' },
        variations: variations || {
          metals: ['9KT', '14KT', '18KT'],
          colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
          sizes: []
        },
        inventory: inventory !== undefined ? Number(inventory) : 10,
        weight: weight ? Number(weight) : 0,
        tags: tags || [],
        status: status || 'Active',
        ratings: 5.0,
        numReviews: 0,
        soldCount: 0,
        createdAt: new Date()
      };

      global.mockProducts.unshift(newProduct); // Add to beginning
      return res.status(201).json(newProduct);
    }

    const product = new Product({
      name,
      description,
      basePrice,
      discountPrice: discountPrice || 0,
      category,
      subcategory,
      images: images || [],
      specifications: specifications || { diamondColor: 'D-E-F', diamondQuality: 'VVS-VS' },
      variations: variations || {
        metals: ['9KT', '14KT', '18KT'],
        colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
        sizes: []
      },
      inventory: inventory !== undefined ? inventory : 10,
      weight: weight || 0,
      tags: tags || [],
      status: status || 'Active'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const {
    name,
    description,
    basePrice,
    discountPrice,
    category,
    subcategory,
    images,
    specifications,
    variations,
    inventory,
    weight,
    tags,
    status
  } = req.body;

  try {
    if (!global.isMongoConnected) {
      const idx = global.mockProducts.findIndex((p) => p._id === req.params.id);

      if (idx > -1) {
        const p = global.mockProducts[idx];
        global.mockProducts[idx] = {
          ...p,
          name: name || p.name,
          description: description || p.description,
          basePrice: basePrice !== undefined ? Number(basePrice) : p.basePrice,
          discountPrice: discountPrice !== undefined ? Number(discountPrice) : p.discountPrice,
          category: category || p.category,
          subcategory: subcategory !== undefined ? subcategory : p.subcategory,
          images: images || p.images,
          specifications: specifications || p.specifications,
          variations: variations || p.variations,
          inventory: inventory !== undefined ? Number(inventory) : p.inventory,
          weight: weight !== undefined ? Number(weight) : p.weight,
          tags: tags || p.tags,
          status: status || p.status
        };
        return res.json(global.mockProducts[idx]);
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.basePrice = basePrice !== undefined ? basePrice : product.basePrice;
      product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
      product.category = category || product.category;
      product.subcategory = subcategory !== undefined ? subcategory : product.subcategory;
      product.images = images || product.images;
      product.specifications = specifications || product.specifications;
      product.variations = variations || product.variations;
      product.inventory = inventory !== undefined ? inventory : product.inventory;
      product.weight = weight !== undefined ? weight : product.weight;
      product.tags = tags || product.tags;
      product.status = status || product.status;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const idx = global.mockProducts.findIndex((p) => p._id === req.params.id);

      if (idx > -1) {
        global.mockProducts.splice(idx, 1);
        return res.json({ message: 'Product removed successfully' });
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
