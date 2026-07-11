import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import MouseLightEffect from './components/MouseLightEffect';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Customize from './pages/Customize';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white dark:bg-[#0F090E] transition-colors duration-300">
        {/* Luxury Loading Screen */}
        <LoadingScreen />

        {/* Premium Mouse Light effect */}
        <MouseLightEffect />

        {/* Sticky top Navigation Header */}
        <Navbar />

        {/* Dynamic Page Router Port */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/customize" element={<Customize />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </main>

        {/* Informational Brand Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
