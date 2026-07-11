import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, HeartHandshake, Truck } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-brand-purple text-white mt-20">
      
      {/* Trust Badges */}
      <div className="border-b border-brand-purpleHover/40 bg-brand-purpleHover/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-8 w-8 text-brand-gold mb-3" />
              <h3 className="font-semibold text-lg">100% Certified Original</h3>
              <p className="text-sm text-gray-300 mt-1">IGI certified lab-grown diamonds of highest color & clarity.</p>
            </div>
            <div className="flex flex-col items-center">
              <HeartHandshake className="h-8 w-8 text-brand-gold mb-3" />
              <h3 className="font-semibold text-lg">Ethical & Eco-friendly</h3>
              <p className="text-sm text-gray-300 mt-1">Zero mining footprint, sustainable, conflict-free luxury.</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="h-8 w-8 text-brand-gold mb-3" />
              <h3 className="font-semibold text-lg">Free Insured Shipping</h3>
              <p className="text-sm text-gray-300 mt-1">Dispatched in tamper-proof packages within India.</p>
            </div>
          </div>
        </div>
      </div>
 
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div>
            <span className="text-2xl font-semibold tracking-widest text-white flex items-center gap-2 mb-4">
              <Logo className="h-9 w-auto text-brand-gold" />
              <span className="font-light">nazara</span>
              <span className="text-brand-gold text-xs font-bold border-l border-white pl-2">DIAMONDS</span>
            </span>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Premium lab-grown diamond jewellery. Affordable luxury, modern silhouettes, and sustainable craftsmanship.
            </p>
          </div>

          {/* Learn links */}
          <div>
            <h4 className="text-brand-gold font-semibold text-sm tracking-wider uppercase mb-4">Learn</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-brand-gold transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Our Diamond Quality</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Policy links */}
          <div>
            <h4 className="text-brand-gold font-semibold text-sm tracking-wider uppercase mb-4">Policies</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-brand-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Return & Refund Policy</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Exchange Policy</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Ring Size Guide</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-brand-gold font-semibold text-sm tracking-wider uppercase mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-2">
                <MapPin className="h-5 w-5 text-brand-gold shrink-0" />
                <span>
                  <strong>Store Address:</strong><br />
                  Nazara Diamonds, 106, Shiv Om Building, MG Road, Indore - 452001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-gold" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-gold" />
                <span>support@nazaradiamonds.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-brand-purpleHover/40 mt-12 pt-8 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Lab Grown Diamond Jewellery in Indore. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
