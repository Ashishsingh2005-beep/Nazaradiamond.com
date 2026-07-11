import React, { useState } from 'react';
import { PencilLine, Send, CheckCircle2 } from 'lucide-react';

export default function Customize() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !idea) return;
    setSuccess(true);
    setName('');
    setEmail('');
    setIdea('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-light text-brand-purple">Bespoke <span className="font-semibold">Customization</span></h1>
        <div className="h-0.5 w-16 bg-brand-gold mx-auto"></div>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          Can't find exactly what you are looking for? Our design specialists can help manufacture custom solitaire pieces designed specifically for you.
        </p>
      </div>

      {/* Steps process breakdown */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="border border-gray-100 bg-white p-6 rounded-lg text-center space-y-3 shadow-sm">
          <span className="h-10 w-10 bg-brand-purple/10 text-brand-purple rounded-full flex items-center justify-center font-bold text-sm mx-auto">1</span>
          <h3 className="font-bold text-lg text-brand-purple">Conceptualize Idea</h3>
          <p className="text-sm text-gray-500">Share your vision, sketches, references, or select standard weights & metal purities.</p>
        </div>

        <div className="border border-gray-100 bg-white p-6 rounded-lg text-center space-y-3 shadow-sm">
          <span className="h-10 w-10 bg-brand-purple/10 text-brand-purple rounded-full flex items-center justify-center font-bold text-sm mx-auto">2</span>
          <h3 className="font-bold text-lg text-brand-purple">CAD & 3D Approval</h3>
          <p className="text-sm text-gray-500">Our CAD specialists model your jewellery piece and share 3D render designs for your feedback.</p>
        </div>

        <div className="border border-gray-100 bg-white p-6 rounded-lg text-center space-y-3 shadow-sm">
          <span className="h-10 w-10 bg-brand-purple/10 text-brand-purple rounded-full flex items-center justify-center font-bold text-sm mx-auto">3</span>
          <h3 className="font-bold text-lg text-brand-purple">Handcrafted Production</h3>
          <p className="text-sm text-gray-500">Upon approval, our master craftsmen cast the gold, set the certified lab grown diamonds, and ship it to you.</p>
        </div>
      </section>

      {/* Contact Customizer Form */}
      <section className="max-w-2xl mx-auto border border-gray-100 bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="text-center space-y-1">
          <PencilLine className="h-8 w-8 text-brand-gold mx-auto" />
          <h2 className="text-xl font-bold text-brand-purple">Let's Connect</h2>
          <p className="text-xs text-gray-400">Tell us what you want to build and we'll reach out within 24 hours.</p>
        </div>

        {success ? (
          <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold p-4 rounded border border-emerald-100 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>Thank you! Your custom jewellery inquiry has been received. Our specialist will email you shortly.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Describe your design idea</label>
              <textarea
                required
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Mention ring size, choice of gold (14KT/18KT), diamond weight (e.g. 1.5 Carats), and overall style description..."
                rows="4"
                className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-purple hover:bg-brand-purpleHover text-white text-xs font-semibold py-3 rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="h-3.5 w-3.5" /> Submit Custom Inquiry
            </button>
          </form>
        )}
      </section>

    </div>
  );
}
