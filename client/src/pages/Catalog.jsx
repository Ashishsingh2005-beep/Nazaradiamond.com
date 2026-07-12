import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Search, Sparkles, Star, ChevronDown, Tag, X } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../store/useStore';
import HoverImage from '../components/HoverImage';

function ProductCard({ p, handleMouseMove, handleMouseLeave }) {
  const colors = p.variations?.colors && p.variations.colors.length > 0 ? p.variations.colors : ['Rose Gold', 'White Gold', 'Yellow Gold'];
  const [selectedColor, setSelectedColor] = useState(colors[0] || 'Rose Gold');

  const getColorFilter = (color) => {
    if (color === 'White Gold') {
      return 'grayscale(100%) brightness(1.15) contrast(1.1)';
    }
    if (color === 'Yellow Gold') {
      return 'sepia(0.4) saturate(2.2) hue-rotate(-15deg) brightness(1.05)';
    }
    if (color === 'Rose Gold') {
      return 'sepia(0.15) saturate(1.4) hue-rotate(-30deg) brightness(1.02)';
    }
    return 'none';
  };

  const filteredImages = p.images ? p.images.filter(img => !img.includes('cropped-icon')) : [];
  if (filteredImages.length === 0 && p.images && p.images.length > 0) {
    filteredImages.push(p.images[0]);
  }

  return (
    <div 
      className="border border-gray-100 dark:border-brand-gold/10 rounded-2xl overflow-hidden bg-white dark:bg-[#1A0F18]/50 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link 
        to={`/product/${p._id}`} 
        className="relative h-64 overflow-hidden bg-gradient-to-b from-brand-gray/10 to-white dark:from-[#20121C] dark:to-[#1A0F18] flex items-center justify-center shrink-0 cursor-pointer"
        style={{ perspective: '1000px' }}
      >
        <div style={{ filter: getColorFilter(selectedColor) }} className="w-full h-full flex items-center justify-center transition-all duration-500">
          <HoverImage
            images={filteredImages}
            alt={p.name}
            tiltStyle={{
              transform: 'rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale(var(--tilt-scale, 1))',
              transformStyle: 'preserve-3d',
            }}
          />
        </div>
        
        {/* Absolute Badges on Image Card */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 shadow-sm">
          {p.ratings >= 4.8 && (
            <span className="bg-brand-purple text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="h-3 w-3 text-brand-gold fill-brand-gold" /> Best Seller
            </span>
          )}
          <span className="bg-white/80 dark:bg-[#1A0F18]/85 backdrop-blur text-brand-purple dark:text-brand-gold text-[8px] uppercase font-bold tracking-widest px-2.5 py-1.5 rounded border border-gray-100 dark:border-brand-gold/15">
            IGI Certified
          </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider bg-brand-gold/10 px-2 py-0.5 rounded-full border border-brand-gold/20">{p.category}</span>
            
            {/* Color Swatches */}
            <div className="flex items-center gap-1.5">
              {colors.map((c) => {
                let swatchClass = "";
                if (c === 'Rose Gold') swatchClass = "bg-gradient-to-tr from-[#e5a99e] to-[#fcdcd3] border-rose-300";
                else if (c === 'White Gold') swatchClass = "bg-gradient-to-tr from-[#d1d5db] to-[#f3f4f6] border-slate-300";
                else if (c === 'Yellow Gold') swatchClass = "bg-gradient-to-tr from-[#f3c844] to-[#fef08a] border-yellow-400";
                
                return (
                  <button
                    key={c}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColor(c);
                    }}
                    title={c}
                    className={`w-3.5 h-3.5 rounded-full border ${swatchClass} transition-all duration-200 ${
                      selectedColor === c ? 'ring-2 ring-brand-purple dark:ring-brand-gold scale-125' : 'hover:scale-110'
                    }`}
                  />
                );
              })}
            </div>
          </div>
          
          <h3 className="font-semibold text-brand-purple dark:text-white text-base mt-2.5 line-clamp-1">
            <Link to={`/product/${p._id}`} className="hover:text-brand-gold transition-colors">{p.name}</Link>
          </h3>
          
          {/* Product Rating and Reviews count */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex text-brand-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < Math.floor(p.ratings) ? 'fill-brand-gold' : 'text-gray-200 dark:text-gray-700'}`} />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">({p.numReviews || 0})</span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 font-light">{p.description}</p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-brand-gold/10 flex items-center justify-between">
          <div>
            <p className="text-[9px] text-gray-400 uppercase font-medium">Starting From</p>
            {p.applicableOffer ? (
              <div>
                <p className="text-brand-gold font-bold text-lg leading-tight">
                  ₹{(p.applicableOffer.discountType === 'fixed'
                    ? Math.max(0, p.basePrice - p.applicableOffer.discountValue)
                    : Math.max(0, p.basePrice * (1 - p.applicableOffer.discountValue / 100))
                  ).toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 line-through">₹{p.basePrice.toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-brand-gold font-bold text-lg leading-tight">₹{p.basePrice.toLocaleString()}</p>
            )}
          </div>
          <Link
            to={`/product/${p._id}`}
            className="bg-brand-purple dark:bg-brand-gold text-white text-xs font-semibold px-4.5 py-2.5 rounded-md hover:bg-brand-purpleHover dark:hover:bg-brand-goldHover transition-colors shadow-sm"
          >
            Configure
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, filter, and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedMetal, setSelectedMetal] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['Rings', 'Earrings', 'Necklaces', 'Pendants', 'Bracelets & Bangles'];

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotX = -(y / (rect.height / 2)) * 12;
    const rotY = (x / (rect.width / 2)) * 12;

    card.style.setProperty('--tilt-x', `${rotX}deg`);
    card.style.setProperty('--tilt-y', `${rotY}deg`);
    card.style.setProperty('--tilt-scale', '1.03');
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
    card.style.setProperty('--tilt-scale', '1');
  };

  // Sync category state with search parameter
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/products?`;
        if (selectedCategory) url += `category=${encodeURIComponent(selectedCategory)}&`;
        if (selectedMetal) url += `metal=${selectedMetal}&`;
        if (selectedSize) url += `size=${encodeURIComponent(selectedSize)}&`;
        if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;

        const { data } = await axios.get(url);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching catalog products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedMetal, selectedSize, searchTerm]);

  // Apply sorting on fetched products
  useEffect(() => {
    let result = [...products];
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.ratings - a.ratings);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFilteredProducts(result);
  }, [products, sortBy]);

  const handleCategoryChange = (category) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    if (newCategory) {
      setSearchParams({ category: newCategory });
    } else {
      setSearchParams({});
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedMetal('');
    setSelectedSize('');
    setSearchTerm('');
    setSearchParams({});
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 dark:bg-[#0F090E] transition-colors duration-300">
      
      {/* Page Title & Subtitle */}
      <div className="text-center space-y-2 py-4">
        <span className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.25em]">IGI CERTIFIED</span>
        <h1 className="text-4xl font-extralight text-brand-purple dark:text-white tracking-wide">
          The Solitaire <span className="font-semibold text-brand-gold">Collection</span>
        </h1>
        <p className="text-xs text-gray-400 dark:text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
          Browse our certified collection of lab-grown diamonds, handcrafted with luxury details and ethically sourced.
        </p>
        <div className="h-0.5 w-12 bg-brand-gold mx-auto mt-3"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Filter Section */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="border border-gray-100 dark:border-brand-gold/10 rounded-2xl p-6 bg-white dark:bg-[#1A0F18]/50 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-brand-gold/10 pb-3">
              <h2 className="text-sm font-semibold text-brand-purple dark:text-white flex items-center gap-2">
                <Filter className="h-4.5 w-4.5 text-brand-gold" /> Filters
              </h2>
              {(selectedCategory || selectedMetal || searchTerm) && (
                <button 
                  onClick={clearAllFilters}
                  className="text-[10px] text-brand-gold font-bold hover:underline uppercase tracking-wider"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Shop by Category filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Categories</h3>
              <div className="flex flex-col space-y-1.5">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`text-left text-xs uppercase tracking-wider py-2 px-3 rounded-md transition-all ${
                    selectedCategory === '' 
                      ? 'bg-brand-purple dark:bg-brand-gold text-white font-bold shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-brand-gold hover:bg-brand-gray/30 dark:hover:bg-brand-purple/20'
                  }`}
                >
                  All Products
                </button>
                {categories.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleCategoryChange(c)}
                    className={`text-left text-xs uppercase tracking-wider py-2 px-3 rounded-md transition-all flex justify-between items-center ${
                      selectedCategory === c 
                        ? 'bg-brand-purple dark:bg-brand-gold text-white font-bold shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-brand-gold hover:bg-brand-gray/30 dark:hover:bg-brand-purple/20'
                    }`}
                  >
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-5 border-t border-gray-100 dark:border-brand-gold/10">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Choice of Metal</h3>
              <div className="grid grid-cols-3 gap-2">
                {['9KT', '14KT', '18KT'].map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMetal(selectedMetal === m ? '' : m)}
                    className={`py-2.5 px-1 text-xs font-bold rounded-md border transition-all ${
                      selectedMetal === m
                        ? 'bg-brand-purple dark:bg-brand-gold text-white border-brand-purple dark:border-brand-gold shadow-sm'
                        : 'border-gray-200 dark:border-brand-gold/20 text-gray-500 dark:text-gray-300 hover:border-brand-purple dark:hover:border-brand-gold bg-white dark:bg-transparent'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by size */}
            <div className="space-y-3 pt-5 border-t border-gray-100 dark:border-brand-gold/10">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Available Sizes</h3>
              <div className="flex flex-wrap gap-1.5">
                {['7', '8', '9', '10', '11', '12', '13', '14', 'One Size'].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                    className={`py-1.5 px-3 text-[10px] font-bold rounded-md border transition-all ${
                      selectedSize === s
                        ? 'bg-brand-purple dark:bg-brand-gold text-white border-brand-purple dark:border-brand-gold shadow-sm'
                        : 'border-gray-200 dark:border-brand-gold/20 text-gray-500 dark:text-gray-300 hover:border-brand-purple dark:hover:border-brand-gold bg-white dark:bg-transparent'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Main Product Catalog Section */}
        <main className="flex-grow space-y-6">
          
          {/* Top Search, Sort & Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-gray-100 dark:border-brand-gold/10 bg-white dark:bg-[#1A0F18]/50 p-4 rounded-xl shadow-sm">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search rings, pendants, sizes (e.g. 10)..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-brand-gold/20 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-brand-gold bg-transparent text-sm font-light text-brand-purple dark:text-white"
              />
              <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                Showing <span className="font-semibold text-brand-purple dark:text-brand-gold">{filteredProducts.length}</span> results
              </p>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-semibold text-brand-purple dark:text-white border border-gray-200 dark:border-brand-gold/20 rounded px-2.5 py-1.5 bg-white dark:bg-[#1A0F18] focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer"
                >
                  <option value="newest">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active filter tags list */}
          {(selectedCategory || selectedMetal || selectedSize || searchTerm) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mr-1">Active filters:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2.5 py-1 rounded-full">
                  Category: {selectedCategory}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryChange(selectedCategory)} />
                </span>
              )}
              {selectedMetal && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2.5 py-1 rounded-full">
                  Metal: {selectedMetal}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedMetal('')} />
                </span>
              )}
              {selectedSize && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2.5 py-1 rounded-full">
                  Size: {selectedSize}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedSize('')} />
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2.5 py-1 rounded-full">
                  Query: {searchTerm}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                </span>
              )}
            </div>
          )}

          {/* Grid list of Products */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-gray-100 dark:border-brand-gold/10 rounded-2xl overflow-hidden h-[380px] skeleton-shimmer"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 border border-gray-100 dark:border-brand-gold/10 bg-white dark:bg-[#1A0F18]/50 rounded-2xl shadow-sm space-y-3">
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No products found matching your filters.</p>
              <button
                onClick={clearAllFilters}
                className="text-xs bg-brand-gold text-white px-6 py-2.5 rounded font-bold uppercase tracking-wider"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard 
                  key={p._id} 
                  p={p} 
                  handleMouseMove={handleMouseMove} 
                  handleMouseLeave={handleMouseLeave} 
                />
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
