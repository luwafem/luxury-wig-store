import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import { siteConfig } from '../config/siteConfig';

const About = () => {
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
      // Balanced hearts – same as all other pages
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
          id: `ABOUT-L-${i}`,
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
          id: `ABOUT-R-${i}`,
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
        title="Our Story — The Art of Hair" 
        description="The heritage and vision behind Nigeria's premier luxury wig maison."
      />

      {/* ✦ PERFECT HEARTS – LEFT & RIGHT EDGES ONLY ✦ */}
      <DecorativeElements />
      
      {/* Editorial Header */}
      <header className="relative z-10 py-16 md:py-24 border-b border-white/5 text-center">
        <h1 className="text-4xl md:text-6xl uppercase tracking-tighter font-light leading-none text-white">Our Story</h1>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Statement */}
          <div className="text-center mb-24">
            <p className="text-lg md:text-2xl  text-neutral-300 max-w-3xl mx-auto leading-relaxed">
              "From a singular passion for aesthetic excellence to Nigeria's leading maison for luxury hair."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 mb-32">
            {/* Timeline: Minimalist Vertical List */}
            <div className="lg:col-span-7 border-t border-white/5 pt-12">
              <h2 className="text-[11px] uppercase tracking-[0.5em] font-bold mb-16 text-pink-400">The Timeline</h2>
              <div className="space-y-20">
                {[
                  { year: "2020", title: "The Inception", desc: "Founded in pursuit of quality that was once unavailable. We began with a single promise: longevity without compromise." },
                  { year: "2021", title: "The First", desc: "The launch of our inaugural collection. A home-grown vision evolving into a recognized standard for 100% virgin hair." },
                  { year: "2022", title: "The Expansion", desc: "Connecting with women across all 36 states. Unifying luxury and accessibility through a nationwide logistics network." },
                  { year: "2023", title: "The Modernity", desc: "The introduction of 360-degree craftsmanship and digital authentication. Beauty meeting innovation." }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-12 group">
                    <span className="text-sm font-serif italic text-neutral-500 group-hover:text-pink-400 transition-colors">{item.year}</span>
                    <div>
                      <h3 className="uppercase tracking-[0.3em] text-[12px] font-bold mb-4 text-white">{item.title}</h3>
                      <p className="text-[11px] uppercase tracking-widest leading-loose text-neutral-400 max-w-md">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission & Values: Border-boxed – now black on black with white text */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 space-y-px bg-black/80 border border-white/5">
                {[
                  { title: "Mission", desc: "To empower the modern woman with hair that enhances her silhouette and withstands the passage of time." },
                  { title: "Vision", desc: "To remain Africa's most trusted arbiter of luxury hair, recognized for unparalleled customer discretion." },
                  { title: "Ethos", desc: "Quality as a prerequisite. Transparency as a foundation. Innovation as a tradition." }
                ].map((box, i) => (
                  <div key={i} className="bg-black/80 p-10 md:p-12 border-b border-white/5 last:border-b-0">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-6 text-pink-400/80">{box.title}</h3>
                    <p className="text-[12px] uppercase tracking-[0.15em] leading-[2] text-white/90">{box.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Founder Section: Grayscale Editorial – noir version */}
          <section className="py-24 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
              <div className="aspect-[4/5] bg-neutral-900 grayscale contrast-125 overflow-hidden border border-white/5">
                <img 
                  src="/images/founder.jpg" 
                  alt="Chinwe Okoro" 
                  className="w-full h-full object-cover mix-blend-luminosity opacity-80"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-pink-400/70 mb-6 block">The Visionary</span>
                <h2 className="text-3xl uppercase tracking-tighter font-light mb-8 text-white">Chinwe Okoro</h2>
                <blockquote className="text-lg  leading-relaxed text-neutral-300 mb-10">
                  "I believe Nigerian women deserve hair that is an investment, not a temporary fix. Seeing that confidence returned is our true measure of success."
                </blockquote>
                <div className="flex gap-8">
                  <a href={siteConfig.social.instagram} className="text-[9px] uppercase tracking-[0.3em] border-b border-white/20 hover:border-pink-400 transition-all text-neutral-400 hover:text-white">
                    Instagram
                  </a>
                  <a href={`https://wa.me/${siteConfig.business.whatsapp}`} className="text-[9px] uppercase tracking-[0.3em] border-b border-white/20 hover:border-pink-400 transition-all text-neutral-400 hover:text-white">
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Quality Promise: Stark Contrast – noir with pink */}
          <section className="bg-black/90 text-white py-24 md:py-32 px-10 text-center -mx-6 md:-mx-20 lg:-mx-32 border-y border-white/5">
             <h2 className="text-2xl md:text-4xl uppercase tracking-[0.3em] font-light mb-16  text-pink-400">The Quality Promise</h2>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
                {[
                  { label: "100% Human", sub: "Selection" },
                  { label: "Bleach-Ready", sub: "Integrity" },
                  { label: "12 Month", sub: "Assurance" },
                  { label: "Seven Stage", sub: "Verification" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-8 h-[1px] bg-pink-400/40 mb-6"></div>
                    <span className="text-[11px] uppercase tracking-[0.4em] font-bold mb-2 text-white">{stat.label}</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">{stat.sub}</span>
                  </div>
                ))}
             </div>
          </section>

          {/* CTA: Ultra Minimal – noir with pink hover */}
          <div className="py-32 text-center">
            <h2 className="text-2xl md:text-3xl uppercase tracking-[0.4em] mb-12 font-extralight text-white">Join the Maison</h2>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <a href="/shop" className="group relative px-16 py-4 overflow-hidden border border-white text-[10px] uppercase tracking-[0.4em] text-white bg-transparent transition-all duration-700">
                <motion.div
                  className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
                  whileHover={{ width: '100%' }}
                />
                <span className="relative z-10 group-hover:text-black transition-colors duration-700">
                  Shop Collection
                </span>
              </a>
              <a href={`https://wa.me/${siteConfig.business.whatsapp}`} className="group relative px-16 py-4 overflow-hidden border border-pink-400/30 text-[10px] uppercase tracking-[0.4em] text-pink-300 bg-transparent transition-all duration-700">
                <motion.div
                  className="absolute inset-0 w-0 bg-pink-400/10 transition-all duration-700 ease-out group-hover:w-full"
                  whileHover={{ width: '100%' }}
                />
                <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                  The Private Suite
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Branding */}
      <footer className="relative z-10 py-20 border-t border-white/5 text-center">
        <div className="w-10 h-[1px] bg-pink-400/50 mx-auto mb-8"></div>
        <p className="text-[9px] uppercase tracking-[0.6em] text-neutral-500">House of Beauty — Lagos</p>
      </footer>
    </div>
  );
};

export default About;