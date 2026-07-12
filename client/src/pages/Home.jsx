import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate as useRouterNavigate } from 'react-router-dom';
import { Shield, Sparkles, Flame, Percent, Star, ArrowRight, Award, ChevronLeft, ChevronRight, Mail, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_URL } from '../store/useStore';
import TiltContainer from '../components/TiltContainer';
import HoverImage from '../components/HoverImage';
import DiamondCanvas from '../components/DiamondCanvas';
import ParticlesBackground from '../components/ParticlesBackground';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useRouterNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [prodRes, offerRes, bannerRes] = await Promise.all([
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/offers`),
          axios.get(`${API_URL}/banners`)
        ]);
        setFeaturedProducts(prodRes.data.slice(0, 4));
        setOffers(offerRes.data.filter(o => o.status === 'Active').slice(0, 3));
        setBanners(bannerRes.data.filter(b => b.isActive));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const categories = [
    { name: 'Rings', count: 54, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=60' },
    { name: 'Earrings', count: 35, image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=60' },
    { name: 'Necklaces', count: 34, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60' },
    { name: 'Pendants', count: 24, image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&auto=format&fit=crop&q=60' },
    { name: 'Bracelets & Bangles', count: 23, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop&q=60' }
  ];

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

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const festivalBanners = banners.filter(b => b.type === 'festival');

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden dark:bg-[#0F090E] transition-colors duration-300">
      
      {/* 3D Premium Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-[#1E0F1B] via-[#0F090E] to-[#121212] flex items-center overflow-hidden border-b border-brand-gold/15">
        <ParticlesBackground />
        
        {/* Soft Radial Gold Lights */}
        <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] rounded-full bg-brand-purple/20 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Hero content */}
          <motion.div 
            className="space-y-8 text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-brand-gold text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase bg-brand-gold/10 px-5.5 py-2.5 rounded-full border border-brand-gold/20 inline-block">
              REAL DIAMONDS, ETHICALLY GROWN
            </span>
            <h1 className="text-4xl sm:text-6xl font-extralight tracking-tight leading-[1.1] text-white">
              Sustainable Luxury <br />
              <span className="font-semibold text-brand-gold">Crafted For Eternity</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-lg max-w-xl font-light leading-relaxed">
              Explore our exquisite, IGI certified lab-grown solitaire diamonds that deliver 100% brilliance and elegance without compromise.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-5">
              <RouterLink
                to="/products"
                className="bg-brand-gold text-white font-bold px-9 py-4 rounded hover:bg-brand-goldHover transition-all shadow-lg hover:shadow-brand-gold/10 uppercase tracking-widest text-xs border border-brand-gold"
              >
                Shop Collection
              </RouterLink>
              <RouterLink
                to="/customize"
                className="bg-transparent text-white font-bold px-9 py-4 rounded hover:bg-white/5 transition-all uppercase tracking-widest text-xs border border-white/20 hover:border-brand-gold"
              >
                Bespoke Design
              </RouterLink>
            </div>
          </motion.div>

          {/* Right Hero content: 3D Canvas / Rotating Diamond */}
          <motion.div
            className="h-[400px] sm:h-[550px] w-full relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer Golden Spinner Ring */}
              <div className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full border border-dashed border-brand-gold/20 animate-[spin_40s_linear_infinite] absolute"></div>
              {/* Mid purple glow Ring */}
              <div className="w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] rounded-full border border-brand-purple/35 absolute"></div>
            </div>
            <div className="w-full h-full relative z-10">
              <DiamondCanvas />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Factors Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { icon: Sparkles, title: 'Affordable Luxury', desc: 'Direct-to-consumer pricing ensures no middleman markups.' },
          { icon: Shield, title: 'Ethical & Eco', desc: 'Lab-grown diamonds bypass negative mining practices.' },
          { icon: Flame, title: 'Modern & Timeless', desc: 'Perfect balance between cutting-edge and heritage design.' },
          { icon: Award, title: '100% Certified', desc: 'Chemically, physically, and optically identical to mined diamonds.' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="border border-gray-100 dark:border-brand-gold/15 bg-brand-gray/40 dark:bg-[#1A0F18]/40 p-7 rounded-2xl text-center flex flex-col items-center hover:border-brand-gold/30 hover:bg-white dark:hover:bg-[#1A0F18]/80 transition-all duration-300 shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <item.icon className="h-8 w-8 text-brand-gold mb-3" />
            <h3 className="font-bold text-sm text-brand-purple dark:text-white uppercase tracking-wider">{item.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-light leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Brand Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] group border border-brand-gold/20"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800"
              alt="Artisan jewelry making"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-purple via-brand-purple/20 to-transparent opacity-60"></div>
          </motion.div>
          
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.25em]">OUR LEGACY</span>
            <h2 className="text-3xl sm:text-4xl font-light text-brand-purple dark:text-white">Crafted by Hand, <br /><span className="font-semibold text-brand-gold">Conceived by Science</span></h2>
            <div className="h-[1px] w-12 bg-brand-gold"></div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              Nazara Diamonds is founded on the belief that fine jewelry should represent love, sustainability, and absolute clarity. By leveraging advanced CVD/HPHT technology, we create real diamonds with the same chemical structure as mined counterparts.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              Every ring, pendant, and bracelet is custom-molded, hand-polished, and certified by reputable international institutes to match the ultimate standards of jewelry making.
            </p>
            <RouterLink to="/customize" className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold hover:text-brand-purple dark:hover:text-white uppercase tracking-widest transition-colors">
              Discover customized service <ArrowRight className="h-4 w-4" />
            </RouterLink>
          </motion.div>
        </div>
      </section>

      {/* Festival Promotional Event Banner */}
      {festivalBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="relative rounded-3xl overflow-hidden h-[340px] bg-brand-purple text-white shadow-2xl flex items-center border border-brand-gold/20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={festivalBanners[0].image} 
              alt={festivalBanners[0].title} 
              className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 hover:scale-100 transition-transform duration-[4s]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E0F1B]/95 via-brand-purple/60 to-transparent"></div>
            <div className="relative z-10 px-8 sm:px-16 max-w-xl space-y-6">
              <span className="text-[9px] text-brand-gold font-bold uppercase tracking-[0.3em] bg-brand-gold/15 px-3 py-1.5 rounded border border-brand-gold/30 inline-block">FESTIVAL CELEBRATION</span>
              <h2 className="text-3xl sm:text-5xl font-extralight uppercase leading-tight tracking-wide">{festivalBanners[0].title}</h2>
              <p className="text-xs text-gray-300 font-light leading-relaxed">Celebrate with sustainable, lab-grown elegance. Make payments easy via Razorpay and redeem active coupons.</p>
              <RouterLink 
                to={festivalBanners[0].buttonLink || '/products'} 
                className="inline-block bg-brand-gold hover:bg-brand-goldHover text-white px-7 py-3 rounded font-bold uppercase tracking-widest text-[10px] transition-colors"
              >
                {festivalBanners[0].buttonText || 'Discover Now'}
              </RouterLink>
            </div>
          </motion.div>
        </section>
      )}

      {/* Shop by Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center">
          <span className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.25em]">FINE COLLECTIONS</span>
          <h2 className="text-3xl font-light text-brand-purple dark:text-white mt-1">Shop By <span className="font-semibold">Categories</span></h2>
          <div className="h-0.5 w-12 bg-brand-gold mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((c, i) => (
            <motion.div 
              key={i}
              onClick={() => navigate(`/products?category=${encodeURIComponent(c.name)}`)}
              className="cursor-pointer group relative h-80 rounded-2xl overflow-hidden border border-gray-100 dark:border-brand-gold/10 shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <img 
                src={c.image} 
                alt={c.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/95 via-brand-purple/15 to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="font-semibold text-base leading-tight uppercase tracking-wider">{c.name}</h3>
                <p className="text-[10px] text-brand-gold mt-1 font-bold">{c.count} Pieces</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center">
          <span className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.25em]">THE EXQUISITES</span>
          <h2 className="text-3xl font-light text-brand-purple dark:text-white mt-1">Featured <span className="font-semibold">Solitaires</span></h2>
          <div className="h-0.5 w-12 bg-brand-gold mx-auto mt-3"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-100 dark:border-brand-gold/10 rounded-2xl overflow-hidden h-[380px] skeleton-shimmer"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {featuredProducts.map((p, idx) => (
              <motion.div 
                key={p._id} 
                className="border border-gray-100 dark:border-brand-gold/10 rounded-2xl overflow-hidden bg-white dark:bg-[#1A0F18]/50 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group relative"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                {/* 3D product-only tilt container inside fixed link wrapper */}
                <RouterLink 
                  to={`/product/${p._id}`} 
                  className="relative h-64 overflow-hidden bg-gradient-to-b from-brand-gray/10 to-white dark:from-[#20121C] dark:to-[#1A0F18] flex items-center justify-center shrink-0 cursor-pointer"
                  style={{ perspective: '1000px' }}
                >
                  <HoverImage
                    images={p.images}
                    alt={p.name}
                    tiltStyle={{
                      transform: 'rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale(var(--tilt-scale, 1))',
                      transformStyle: 'preserve-3d',
                    }}
                  />
                  
                  {p.ratings >= 4.8 && (
                    <span className="absolute top-3 left-3 bg-brand-purple text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Sparkles className="h-3 w-3 text-brand-gold fill-brand-gold" /> Best Seller
                    </span>
                  )}
                </RouterLink>

                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider bg-brand-gold/10 px-2 py-0.5 rounded-full border border-brand-gold/20">{p.category}</span>
                    <h3 className="font-semibold text-brand-purple dark:text-white text-sm mt-3.5 line-clamp-1">
                      <RouterLink to={`/product/${p._id}`} className="hover:text-brand-gold transition-colors">{p.name}</RouterLink>
                    </h3>
                    
                    {/* Star ratings */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="flex text-brand-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < Math.floor(p.ratings) ? 'fill-brand-gold' : 'text-gray-200 dark:text-gray-700'}`} />
                        ))}
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium">({p.numReviews || 0})</span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 font-light leading-relaxed">{p.description}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-brand-gold/10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-medium">Price</p>
                      
                      {p.applicableOffer ? (
                        <div>
                          <p className="text-brand-gold font-bold text-base leading-tight">
                            ₹{(p.applicableOffer.discountType === 'fixed'
                              ? Math.max(0, p.basePrice - p.applicableOffer.discountValue)
                              : Math.max(0, p.basePrice * (1 - p.applicableOffer.discountValue / 100))
                            ).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-gray-400 line-through">₹{p.basePrice.toLocaleString()}</p>
                        </div>
                      ) : (
                        <p className="text-brand-gold font-bold text-base leading-tight">₹{p.basePrice.toLocaleString()}</p>
                      )}
                    </div>
                    <RouterLink
                      to={`/product/${p._id}`}
                      className="bg-brand-purple hover:bg-brand-purpleHover dark:bg-brand-gold dark:hover:bg-brand-goldHover text-white text-xs font-semibold px-4.5 py-2.5 rounded-md transition-colors shadow-sm"
                    >
                      Configure
                    </RouterLink>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Luxury Client Reviews / Stories */}
      <section className="bg-brand-gray/30 dark:bg-[#1A0F18]/25 border-t border-b border-gray-100 dark:border-brand-gold/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center">
            <span className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.25em]">HAPPY CLIENTS</span>
            <h2 className="text-3xl font-light text-brand-purple dark:text-white mt-1">Stories of <span className="font-semibold">Sparkle</span></h2>
            <div className="h-0.5 w-12 bg-brand-gold mx-auto mt-2"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: '"The product quality exceeded all my expectations. The diamond shines just like a natural one, and the IGI certification certificate gives absolute confidence."', author: 'Shalini K.', city: 'Indore' },
              { text: '"We bought our engagement rings from Nazara. The offline custom service was highly professional, and the price was half of what traditional showrooms quote!"', author: 'Raman & Deepika', city: 'Bhopal' },
              { text: '"Fast, insured shipping and beautiful box packaging. Applied code MK1100 at checkout and got ₹1100 off on making charges instantly. Highly recommend!"', author: 'Aditya Shah', city: 'Mumbai' },
            ].map((rev, i) => (
              <motion.div
                key={i}
                className="bg-white dark:bg-[#20121C]/50 p-7 rounded-2xl shadow-sm border border-gray-50 dark:border-brand-gold/10 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex text-brand-gold">
                  {[...Array(5)].map((_, idx) => <Star key={idx} className="h-4 w-4 fill-brand-gold text-brand-gold" />)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-300 italic font-light leading-relaxed">
                  {rev.text}
                </p>
                <div className="pt-3 border-t border-gray-100 dark:border-brand-gold/10">
                  <p className="text-xs font-semibold text-brand-purple dark:text-brand-gold">{rev.author}</p>
                  <p className="text-[10px] text-gray-400">{rev.city}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery & Social Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center">
          <span className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.25em]">#NAZARADIAMONDS</span>
          <h2 className="text-3xl font-light text-brand-purple dark:text-white mt-1">Social <span className="font-semibold">Inspirations</span></h2>
          <div className="h-0.5 w-12 bg-brand-gold mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
            'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500',
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'
          ].map((url, i) => (
            <motion.div
              key={i}
              className="relative aspect-square overflow-hidden rounded-2xl group border border-brand-gold/10"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <img src={url} alt={`Social Post ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-brand-purple/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="text-white text-xs font-semibold">View Post</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-brand-gray/50 dark:bg-[#1C0F19]/40 border border-gray-100 dark:border-brand-gold/10 rounded-3xl p-8 sm:p-16 text-center space-y-6 max-w-4xl mx-auto relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-brand-gold/5 rounded-full blur-2xl"></div>
          
          <Mail className="h-10 w-10 text-brand-gold mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-light text-brand-purple dark:text-white">Join The Nazara Circle</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 max-w-md mx-auto font-light leading-relaxed">
            Subscribe to receive priority notifications on bespoke collections, festival offers, and ethical lab-diamond guides.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow px-5 py-3.5 rounded-lg border border-gray-200 dark:border-brand-gold/20 bg-white dark:bg-[#0F090E] text-xs focus:ring-1 focus:ring-brand-gold outline-none text-brand-purple dark:text-white"
            />
            <button className="bg-brand-purple hover:bg-brand-purpleHover dark:bg-brand-gold dark:hover:bg-brand-goldHover text-white px-7 py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest shrink-0 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
