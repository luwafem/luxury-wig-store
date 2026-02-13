import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { siteConfig } from '../../config/siteConfig';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "The Selection",
      links: [
        { label: "The Shop", path: "/shop" },
        { label: "Our Story", path: "/about" }
      ]
    },
    {
      title: "Client Concierge",
      links: [
        { label: "Shipping & Returns", path: "/policies?type=delivery" },
        { label: "Privacy Policy", path: "/policies?type=privacy" },
        { label: "Terms of Service", path: "/policies?type=terms" }
      ]
    }
  ];

  // ─────────────────────────────────────────────────────────
  //  PERFECT HEART – solid, filled, subtle
  //  Extremely low opacity, few in number
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
      // ⬇︎ EXTREMELY SUBTLE – 3–6 hearts on desktop, 2–4 on mobile
      const isMobile = window.innerWidth < 768;
      const total = isMobile
        ? Math.floor(Math.random() * 2) + 2   // 2–4
        : Math.floor(Math.random() * 3) + 3; // 3–6
      
      const leftCount = Math.ceil(total / 2);
      const rightCount = Math.floor(total / 2);
      
      const minSize = isMobile ? 20 : 24;
      const maxSize = isMobile ? 44 : 64;
      
      const newElements = [];

      // Left side (0–15%)
      for (let i = 0; i < leftCount; i++) {
        newElements.push({
          id: `L-${i}`,
          x: Math.random() * 15,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.2 + 0.2, // 0.2–0.4 – barely visible
          color: `rgba(236, 72, 153, ${Math.random() * 0.2 + 0.2})`, // very subtle pink
          delay: i * 0.15,
        });
      }

      // Right side (85–100%)
      for (let i = 0; i < rightCount; i++) {
        newElements.push({
          id: `R-${i}`,
          x: Math.random() * 15 + 85,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.2 + 0.2,
          color: `rgba(236, 72, 153, ${Math.random() * 0.2 + 0.2})`,
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
    <footer className="bg-black text-white border-t border-white/5 pt-24 pb-12 antialiased relative overflow-hidden">
      {/* ✦ PERFECT HEARTS – EXTREMELY SUBTLE, LEFT & RIGHT EDGES ✦ */}
      <DecorativeElements />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand Essence - 5 Columns */}
          <div className="lg:col-span-5 space-y-10">
            <Link to="/" className="inline-block group">
              <h2 className="text-3xl font-light uppercase tracking-[0.4em] leading-none">
                {siteConfig.brandName}
              </h2>
              <div className="h-[1px] w-0 group-hover:w-full bg-pink-500 transition-all duration-700 mt-2" />
              <p className="text-[9px] uppercase tracking-[0.6em] text-pink-500/60 mt-4">
                Atelier of Excellence
              </p>
            </Link>
            
            <p className="text-[13px] font-light leading-relaxed text-neutral-400 max-w-sm">
              Architecting premium 100% raw virgin hair for the discerning woman. 
              A synthesis of high-fashion editorial aesthetics and hand-finished craftsmanship.
            </p>

            <div className="flex space-x-8">
              {['Instagram', 'Facebook', 'WhatsApp'].map((social) => (
                <a 
                  key={social}
                  href={siteConfig.social[social.toLowerCase()]}
                  className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 hover:text-pink-400 transition-colors duration-500"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Sections - 4 Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-white font-bold mb-8">
                  {section.title}
                </h3>
                <ul className="space-y-5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        to={link.path} 
                        className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-all duration-300 flex items-center group"
                      >
                        <span className="w-0 group-hover:w-3 h-[1px] bg-pink-500 mr-0 group-hover:mr-3 transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter - 3 Columns */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-white font-bold mb-8">
              The Insider
            </h3>
            <form className="relative group">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-transparent border-b border-neutral-800 py-3 text-[10px] tracking-[0.3em] focus:outline-none focus:border-pink-500 transition-colors placeholder:text-neutral-700"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-[0.3em] text-pink-500 font-bold hover:text-white transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[8px] text-neutral-600 mt-6 leading-relaxed tracking-widest uppercase">
              By joining, you accept our invitation to exclusivity and private releases.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Ultra Clean Noir */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
            &copy; {currentYear} {siteConfig.brandName} — All pieces hand-finished in our atelier.
          </span>
          
          <div className="flex items-center space-x-10 opacity-30 grayscale hover:opacity-100 transition-all duration-1000">
            <img 
              src="https://www.paystack.com/assets/img/logos/paystack-logo-white.png" 
              alt="Paystack" 
              className="h-3" 
            />
            <div className="h-3 w-[1px] bg-neutral-800" />
            <span className="text-[9px] tracking-[0.4em] text-neutral-400 font-light">SECURE ENCRYPTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;