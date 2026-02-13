import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
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

  // ─────────────────────────────────────────────────────────
  //  PERFECT HEART – solid, filled, smooth
  //  Placed only on left/right edges, balanced counts
  // ─────────────────────────────────────────────────────────
  const PerfectHeart = ({ size, color, opacity, rotate, delay }) => {
    const heartPath = "M12,4 C8,-2 0,0 0,7 C0,14 12,20 12,20 C12,20 24,14 24,7 C24,0 16,-2 12,4 Z";

    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ rotate }}
        initial={{ opacity: 0, y: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1,
          y: [0, -6, 0],
          scale: 1
        }}
        transition={{
          opacity: { delay, duration: 0.6, ease: "easeOut" },
          scale: { delay, duration: 0.6, ease: "easeOut" },
          y: {
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 0.8
          }
        }}
      >
        <path
          d={heartPath}
          fill={color}
          fillOpacity={opacity}
        />
      </motion.svg>
    );
  };

  const DecorativeElements = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
      // Balanced hearts – same as Shop / ProductDetails
      const isMobile = window.innerWidth < 768;
      const total = isMobile
        ? Math.floor(Math.random() * 5) + 3   // 3–8
        : Math.floor(Math.random() * 7) + 5; // 5–12
      
      const leftCount = Math.ceil(total / 2);
      const rightCount = Math.floor(total / 2);
      
      const minSize = isMobile ? 24 : 32;
      const maxSize = isMobile ? 54 : 84;
      
      const newElements = [];

      // Left side (0–15%)
      for (let i = 0; i < leftCount; i++) {
        newElements.push({
          id: `CONTACT-L-${i}`,
          x: Math.random() * 15,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.5, // 0.5–0.9
          color: `rgba(236, 72, 153, ${Math.random() * 0.4 + 0.5})`,
          delay: i * 0.15,
        });
      }

      // Right side (85–100%)
      for (let i = 0; i < rightCount; i++) {
        newElements.push({
          id: `CONTACT-R-${i}`,
          x: Math.random() * 15 + 85,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.5,
          color: `rgba(236, 72, 153, ${Math.random() * 0.4 + 0.5})`,
          delay: (leftCount + i) * 0.15,
        });
      }

      setElements(newElements);
    }, []);

    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {elements.map((el) => (
          <div
            key={el.id}
            className="absolute"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            <PerfectHeart
              size={el.size}
              color={el.color}
              opacity={el.opacity}
              rotate={el.rotate}
              delay={el.delay}
            />
          </div>
        ))}
      </div>
    );
  };
  // ─────────────────────────────────────────────────────────

  return (
    <div className="bg-black text-white antialiased min-h-screen relative overflow-hidden">
      <SEO 
        title="Mamusca – Private Concierge" 
        description="Contact our specialists for bespoke orders and private consultations."
      />

      {/* ✦ PERFECT HEARTS – LEFT & RIGHT EDGES ONLY ✦ */}
      <DecorativeElements />

      {/* Editorial Header */}
      <header className="relative z-10 py-16 md:py-24 border-b border-white/5 text-center">
        <span className="block uppercase tracking-[0.6em] text-[10px] mb-4 text-pink-400/70">Contact Us</span>
        <h1 className="text-4xl md:text-6xl uppercase tracking-tighter font-light leading-none text-white">
          customer service
        </h1>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-12 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            
            {/* Left: Boutique Information */}
            <div className="lg:col-span-4 space-y-16">
              <section>
                <h3 className="text-[10px] uppercase tracking-[0.5em] font-bold mb-8 text-pink-400">Direct Inquiries</h3>
                <div className="space-y-6">
                  <div className="group cursor-pointer">
                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 mb-1">WhatsApp Concierge</p>
                    <a 
                      href={`https://wa.me/${siteConfig.business.whatsapp}`} 
                      className="text-sm uppercase tracking-widest border-b border-transparent group-hover:border-pink-400 transition-all text-white/80 hover:text-white"
                    >
                      {siteConfig.business.phone}
                    </a>
                  </div>
                  <div className="group cursor-pointer">
                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Electronic Mail</p>
                    <a 
                      href={`mailto:${siteConfig.business.email}`} 
                      className="text-sm uppercase tracking-widest border-b border-transparent group-hover:border-pink-400 transition-all text-white/80 hover:text-white"
                    >
                      {siteConfig.business.email}
                    </a>
                  </div>
                </div>
              </section>

              <section className="pt-12 border-t border-white/5">
                <h3 className="text-[10px] uppercase tracking-[0.5em] font-bold mb-8 text-pink-400">Our Store</h3>
                <p className="text-[11px] uppercase tracking-[0.2em] leading-loose text-neutral-400 mb-6">
                  {siteConfig.business.address}
                </p>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-medium text-white">Monday — Friday</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">09:00 — 18:00</p>
                </div>
              </section>

              <section className="pt-12 border-t border-white/5">
                <h3 className="text-[10px] uppercase tracking-[0.5em] font-bold mb-8 text-pink-400">Mamusca</h3>
                <div className="flex gap-6">
                  {['instagram', 'facebook', 'twitter'].map((platform) => (
                    <a 
                      key={platform} 
                      href={siteConfig.social[platform]} 
                      className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 hover:text-pink-400 transition-colors"
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
                  className="h-full flex flex-col items-center justify-center text-center p-12 border border-white/5 bg-black/40"
                >
                  <span className="text-4xl mb-6 font-light text-pink-400">L'Envoi Réussi</span>
                  <h3 className="text-xl uppercase tracking-[0.3em] font-light mb-4 text-white">Message Received</h3>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 leading-relaxed max-w-xs">
                    Our specialists will review your inquiry and respond within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                    <div className="border-b border-white/10 focus-within:border-pink-400 transition-colors">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full py-4 text-xs uppercase tracking-widest bg-transparent outline-none text-white placeholder:text-neutral-700"
                        placeholder="Identification"
                      />
                    </div>
                    
                    <div className="border-b border-white/10 focus-within:border-pink-400 transition-colors">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full py-4 text-xs uppercase tracking-widest bg-transparent outline-none text-white placeholder:text-neutral-700"
                        placeholder="Correspondence"
                      />
                    </div>

                    <div className="border-b border-white/10 focus-within:border-pink-400 transition-colors">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full py-4 text-xs uppercase tracking-widest bg-transparent outline-none text-white placeholder:text-neutral-700"
                        placeholder="Direct Line"
                      />
                    </div>

                    <div className="border-b border-white/10 focus-within:border-pink-400 transition-colors">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">Nature of Inquiry</label>
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full py-4 text-xs uppercase tracking-widest bg-transparent outline-none appearance-none text-white"
                      >
                        <option value="" className="bg-black text-neutral-400">Select Category</option>
                        <option value="Bespoke Order" className="bg-black text-white">Bespoke Order</option>
                        <option value="Maintenance" className="bg-black text-white">Maintenance</option>
                        <option value="General" className="bg-black text-white">General Inquiry</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="border-b border-white/10 focus-within:border-pink-400 transition-colors">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full py-4 text-xs uppercase tracking-widest bg-transparent outline-none resize-none text-white placeholder:text-neutral-700"
                      placeholder="Specify your requirements..."
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-8">
                    <div className="hidden md:block">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 max-w-[200px] leading-relaxed">
                        By submitting, you agree to our private client terms.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full md:w-auto px-16 py-5 overflow-hidden border border-white text-[10px] uppercase tracking-[0.4em] text-white bg-transparent transition-all duration-700 disabled:opacity-50"
                    >
                      <motion.div
                        className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
                        whileHover={{ width: '100%' }}
                      />
                      <span className="relative z-10 group-hover:text-black transition-colors duration-700">
                        {loading ? 'Processing...' : 'Send Inquiry'}
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {/* Bespoke Notice: Subtle Box */}
              <div className="mt-20 p-10 border border-white/5 bg-black/40">
                <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 flex items-center text-pink-400">
                  <span className="w-4 h-[1px] bg-pink-400/50 mr-3"></span>
                  Custom wigs
                </h4>
                <p className="text-[10px] uppercase tracking-[0.2em] leading-loose text-neutral-400">
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