import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { siteConfig } from '../config/siteConfig';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate concierge processing
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 2000);
  };

  return (
    <div className="bg-white text-black antialiased min-h-screen">
      <SEO 
        title="Concierge — LuxuryLocks Nigeria" 
        description="Contact our specialists for bespoke orders and private consultations."
      />
      
      {/* Editorial Header */}
      <header className="py-16 md:py-24 border-b border-black/5 text-center">
        <span className="block uppercase tracking-[0.6em] text-[10px] mb-4 text-neutral-400">Le Contact</span>
        <h1 className="text-4xl md:text-6xl uppercase tracking-tighter font-light leading-none">The Private Suite</h1>
      </header>

      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            
            {/* Left: Boutique Information */}
            <div className="lg:col-span-4 space-y-16">
              <section>
                <h3 className="text-[10px] uppercase tracking-[0.5em] font-bold mb-8 text-neutral-400">Direct Inquiries</h3>
                <div className="space-y-6">
                  <div className="group cursor-pointer">
                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 mb-1">WhatsApp Concierge</p>
                    <a href={`https://wa.me/${siteConfig.business.whatsapp}`} className="text-sm uppercase tracking-widest border-b border-transparent group-hover:border-black transition-all">
                      {siteConfig.business.phone}
                    </a>
                  </div>
                  <div className="group cursor-pointer">
                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Electronic Mail</p>
                    <a href={`mailto:${siteConfig.business.email}`} className="text-sm uppercase tracking-widest border-b border-transparent group-hover:border-black transition-all">
                      {siteConfig.business.email}
                    </a>
                  </div>
                </div>
              </section>

              <section className="pt-12 border-t border-black/5">
                <h3 className="text-[10px] uppercase tracking-[0.5em] font-bold mb-8 text-neutral-400">The Studio</h3>
                <p className="text-[11px] uppercase tracking-[0.2em] leading-loose text-neutral-600 mb-6">
                  {siteConfig.business.address}
                </p>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-medium">Monday — Friday</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">09:00 — 18:00</p>
                </div>
              </section>

              <section className="pt-12 border-t border-black/5">
                <h3 className="text-[10px] uppercase tracking-[0.5em] font-bold mb-8 text-neutral-400">Maison Social</h3>
                <div className="flex gap-6">
                  {['instagram', 'facebook', 'twitter'].map((platform) => (
                    <a 
                      key={platform} 
                      href={siteConfig.social[platform]} 
                      className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 hover:text-black transition-colors"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </section>
            </div>

            {/* Right: Bespoke Inquiry Form */}
            <div className="lg:col-span-8">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border border-black/5"
                >
                  <span className="text-4xl mb-6 font-light">L'Envoi Réussi</span>
                  <h3 className="text-xl uppercase tracking-[0.3em] font-light mb-4">Message Received</h3>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 leading-relaxed max-w-xs">
                    Our specialists will review your inquiry and respond within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                    <div className="border-b border-black/10 focus-within:border-black transition-colors">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full py-4 text-xs uppercase tracking-widest bg-transparent outline-none"
                        placeholder="Identification"
                      />
                    </div>
                    
                    <div className="border-b border-black/10 focus-within:border-black transition-colors">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full py-4 text-xs uppercase tracking-widest bg-transparent outline-none"
                        placeholder="Correspondence"
                      />
                    </div>

                    <div className="border-b border-black/10 focus-within:border-black transition-colors">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full py-4 text-xs uppercase tracking-widest bg-transparent outline-none"
                        placeholder="Direct Line"
                      />
                    </div>

                    <div className="border-b border-black/10 focus-within:border-black transition-colors">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">Nature of Inquiry</label>
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full py-4 text-xs uppercase tracking-widest bg-transparent outline-none appearance-none"
                      >
                        <option value="">Select Category</option>
                        <option value="Bespoke Order">Bespoke Order</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="General">General Inquiry</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="border-b border-black/10 focus-within:border-black transition-colors">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full py-4 text-xs uppercase tracking-widest bg-transparent outline-none resize-none"
                      placeholder="Specify your requirements..."
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-8">
                    <div className="hidden md:block">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 max-w-[200px] leading-relaxed">
                        By submitting, you agree to our private client terms.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-16 py-5 bg-black text-white uppercase tracking-[0.4em] text-[10px] hover:bg-neutral-800 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Send Inquiry'}
                    </button>
                  </div>
                </form>
              )}

              {/* Bespoke Notice: Subtle Box */}
              <div className="mt-20 p-10 border border-black/5 bg-[#f9f9f9] grayscale">
                <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 flex items-center">
                  <span className="w-4 h-[1px] bg-black mr-3"></span>
                  Custom Atelier
                </h4>
                <p className="text-[10px] uppercase tracking-[0.2em] leading-loose text-neutral-500">
                  Our artisans specialize in bespoke tailoring. For custom density, rare textures, or specific color matching, please provide detailed specifications. A specialist will be assigned to your request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;