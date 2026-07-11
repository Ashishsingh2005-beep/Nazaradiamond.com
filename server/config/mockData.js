const mockUsers = [
  {
    _id: 'user_mock_admin_id_001',
    name: 'Nazara Admin',
    email: 'admin@nazaradiamonds.com',
    password: 'admin12345',
    role: 'admin',
    createdAt: new Date()
  },
  {
    _id: 'user_mock_cust_id_002',
    name: 'Regular Customer',
    email: 'user@nazaradiamonds.com',
    password: 'user12345',
    role: 'user',
    createdAt: new Date()
  }
];

const mockProducts = [
  {
    _id: 'prod_mock_baguette_001',
    name: 'Baguette Sleek Band',
    description: 'A delicate and minimal band featuring an elegant baguette-cut solitaire diamond set in your choice of gold. Ideal for stacking or standalone wear.',
    basePrice: 15892,
    category: 'Rings',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '0.25 Carats',
      metalWeight: '2.10 grams',
      certification: 'IGI Certified',
      diamondCut: 'Excellent Baguette Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17']
    },
    inventory: 25,
    ratings: 4.8,
    numReviews: 14,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_solitaire_002',
    name: 'Bloom Six-Prong Solitaire',
    description: 'A classic and breathtaking solitaire ring featuring a brilliant round-cut lab-grown diamond held by six delicate claws. Exemplifies grace and timelessness.',
    basePrice: 91495,
    category: 'Rings',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '1.00 Carats',
      metalWeight: '3.40 grams',
      certification: 'IGI Certified',
      diamondCut: 'Ideal Round Brilliant'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17']
    },
    inventory: 15,
    ratings: 5.0,
    numReviews: 24,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_studs_003',
    name: 'Bloom Cluster Studs',
    description: 'A stunning pair of cluster diamond earrings that reflect light from every angle. Made with sustainable, brilliant round cut lab-grown diamonds.',
    basePrice: 56989,
    category: 'Earrings',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600',
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '0.80 Carats Total',
      metalWeight: '2.50 grams',
      certification: 'IGI Certified',
      diamondCut: 'Very Good Cluster Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['One Size']
    },
    inventory: 30,
    ratings: 4.6,
    numReviews: 18,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_pendant_004',
    name: 'Infinity Loop Pendant',
    description: 'A contemporary infinity design looping gracefully around a central floating solitaire diamond. Symbolizes eternal beauty and ethical elegance.',
    basePrice: 28450,
    category: 'Pendants',
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '0.40 Carats',
      metalWeight: '3.10 grams',
      certification: 'IGI Certified',
      diamondCut: 'Excellent Round Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['One Size']
    },
    inventory: 20,
    ratings: 4.9,
    numReviews: 15,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_celeste_ring_005',
    name: 'Celeste Round Solitaire Ring',
    description: 'An elegant round-cut solitaire diamond ring featuring a sparkling micro-pave crown band. Represents ultimate luxury and class.',
    basePrice: 83378,
    category: 'Rings',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '0.90 Carats',
      metalWeight: '3.80 grams',
      certification: 'IGI Certified',
      diamondCut: 'Ideal Brilliant Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17']
    },
    inventory: 12,
    ratings: 5.0,
    numReviews: 16,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_radiant_006',
    name: 'Radiant Aura Solitaire Ring',
    description: 'A magnificent radiant-cut diamond ring enclosed in a sparkling pave halo of diamonds. Designed to shine bright on any occasion.',
    basePrice: 66795,
    category: 'Rings',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '0.75 Carats',
      metalWeight: '3.20 grams',
      certification: 'IGI Certified',
      diamondCut: 'Excellent Radiant Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17']
    },
    inventory: 18,
    ratings: 4.7,
    numReviews: 13,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_emerald_007',
    name: 'Emerald Crest Solitaire Ring',
    description: 'A stately emerald-cut solitaire lab-grown diamond held by double prongs on a clean, classic polished gold band.',
    basePrice: 106198,
    category: 'Rings',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '1.20 Carats',
      metalWeight: '4.20 grams',
      certification: 'IGI Certified',
      diamondCut: 'Ideal Emerald Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17']
    },
    inventory: 8,
    ratings: 4.9,
    numReviews: 34,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_oval_008',
    name: 'Oval Petal Halo Ring',
    description: 'A majestic oval diamond bordered by a delicate halo of round diamonds resembling blossoming spring flower petals.',
    basePrice: 136069,
    category: 'Rings',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '1.50 Carats',
      metalWeight: '4.80 grams',
      certification: 'IGI Certified',
      diamondCut: 'Ideal Oval Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17']
    },
    inventory: 10,
    ratings: 5.0,
    numReviews: 19,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_circle_009',
    name: 'Circle Layered Necklace',
    description: 'A beautiful gold necklace featuring double delicate layers of gold chain with circular solitaire pendants that shimmer beautifully.',
    basePrice: 59500,
    category: 'Necklaces',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '0.60 Carats Total',
      metalWeight: '5.20 grams',
      certification: 'IGI Certified',
      diamondCut: 'Ideal Round Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['One Size']
    },
    inventory: 15,
    ratings: 5.0,
    numReviews: 11,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_marquise_010',
    name: 'Bloom Marquise Drops',
    description: 'Elegant marquise-cut diamonds dropped below gold loops. Perfect for evenings, weddings, or celebratory dress codes.',
    basePrice: 65487,
    category: 'Earrings',
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '0.70 Carats Total',
      metalWeight: '3.50 grams',
      certification: 'IGI Certified',
      diamondCut: 'Excellent Marquise Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['One Size']
    },
    inventory: 14,
    ratings: 4.8,
    numReviews: 17,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_bracelet_011',
    name: 'Tennis Solitaire Bracelet',
    description: 'A classical, premium gold tennis bracelet featuring an endless row of brilliant round-cut lab grown diamonds.',
    basePrice: 85000,
    category: 'Bracelets & Bangles',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '2.50 Carats Total',
      metalWeight: '8.40 grams',
      certification: 'IGI Certified',
      diamondCut: 'Ideal Round Brilliant'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['S', 'M', 'L']
    },
    inventory: 10,
    ratings: 5.0,
    numReviews: 22,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_halo_hoops_012',
    name: 'Halo Eternity Hoops',
    description: 'Breathtaking hoop earrings adorned with hand-set micro-diamonds on both inner and outer curves for maximum shimmer.',
    basePrice: 42350,
    category: 'Earrings',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600',
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '0.50 Carats Total',
      metalWeight: '3.90 grams',
      certification: 'IGI Certified',
      diamondCut: 'Very Good Hoop Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['One Size']
    },
    inventory: 12,
    ratings: 4.9,
    numReviews: 9,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_teardrop_013',
    name: 'Teardrop Solitaire Pendant',
    description: 'A classic pear-shaped solitaire lab grown diamond hanging gracefully on a delicate chain. Understated and timeless.',
    basePrice: 33200,
    category: 'Pendants',
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '0.45 Carats',
      metalWeight: '2.80 grams',
      certification: 'IGI Certified',
      diamondCut: 'Excellent Pear Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['One Size']
    },
    inventory: 15,
    ratings: 4.8,
    numReviews: 11,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_choker_014',
    name: 'Princess Tennis Choker',
    description: 'A luxurious choker necklace showcasing square princess-cut diamonds lined shoulder-to-shoulder in solid white gold.',
    basePrice: 195000,
    category: 'Necklaces',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '5.00 Carats Total',
      metalWeight: '18.20 grams',
      certification: 'IGI Certified',
      diamondCut: 'Ideal Princess Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['One Size']
    },
    inventory: 5,
    ratings: 5.0,
    numReviews: 7,
    createdAt: new Date()
  },
  {
    _id: 'prod_mock_bangle_015',
    name: 'Elite Diamond Bangle',
    description: 'A striking oval-shaped statement bangle featuring diagonal cuts of baguette and round brilliant solitaires. A crown jewel for any wrist.',
    basePrice: 125000,
    category: 'Bracelets & Bangles',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600'
    ],
    specifications: {
      diamondColor: 'D-E-F',
      diamondQuality: 'VVS-VS',
      caratWeight: '2.00 Carats Total',
      metalWeight: '12.50 grams',
      certification: 'IGI Certified',
      diamondCut: 'Excellent Mixed Cut'
    },
    variations: {
      metals: ['9KT', '14KT', '18KT'],
      colors: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      sizes: ['2.2', '2.4', '2.6', '2.8']
    },
    inventory: 8,
    ratings: 5.0,
    numReviews: 12,
    createdAt: new Date()
  }
];

const mockOffers = [
  {
    _id: 'offer_mock_diwali_001',
    name: 'Diwali Celebration Offer',
    code: 'DIWALI20',
    discountType: 'percentage',
    discountValue: 20,
    minPurchaseAmount: 10000,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true
  },
  {
    _id: 'offer_mock_rakhi_002',
    name: 'Raksha Bandhan Discount',
    code: 'RAKHI15',
    discountType: 'percentage',
    discountValue: 15,
    minPurchaseAmount: 5000,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true
  },
  {
    _id: 'offer_mock_welcome_003',
    name: 'Flat Discount',
    code: 'WELCOME1000',
    discountType: 'fixed',
    discountValue: 1000,
    minPurchaseAmount: 15000,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true
  },
  {
    _id: 'offer_mock_nazar_004',
    name: 'Nazara Special Coupon',
    code: 'MK1100',
    discountType: 'fixed',
    discountValue: 1100,
    minPurchaseAmount: 20000,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true
  }
];

module.exports = { mockUsers, mockProducts, mockOffers };
