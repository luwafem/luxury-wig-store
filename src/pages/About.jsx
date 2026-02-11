import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import { siteConfig } from '../config/siteConfig';

const About = () => {
  return (
    <div className="bg-white text-black antialiased">
      <SEO 
        title="L'Histoire — L'Art de la Coiffure" 
        description="The heritage and vision behind Nigeria's premier luxury wig maison."
      />
      
      {/* Editorial Header */}
      <header className="py-16 md:py-24 border-b border-black/5 text-center">
        <span className="block uppercase tracking-[0.6em] text-[10px] mb-4 text-neutral-400">Notre Héritage</span>
        <h1 className="text-4xl md:text-6xl uppercase tracking-tighter font-light leading-none">Our Story</h1>
      </header>

      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Statement */}
          <div className="text-center mb-24">
            <p className="text-lg md:text-2xl font-serif italic text-neutral-800 max-w-3xl mx-auto leading-relaxed">
              "From a singular passion for aesthetic excellence to Nigeria's leading maison for luxury hair."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 mb-32">
            {/* Timeline: Minimalist Vertical List */}
            <div className="lg:col-span-7 border-t border-black pt-12">
              <h2 className="text-[11px] uppercase tracking-[0.5em] font-bold mb-16">The Timeline</h2>
              <div className="space-y-20">
                {[
                  { year: "2020", title: "The Inception", desc: "Founded in pursuit of quality that was once unavailable. We began with a single promise: longevity without compromise." },
                  { year: "2021", title: "La Première", desc: "The launch of our inaugural collection. A home-grown vision evolving into a recognized standard for 100% virgin hair." },
                  { year: "2022", title: "L'Expansion", desc: "Connecting with women across all 36 states. Unifying luxury and accessibility through a nationwide logistics network." },
                  { year: "2023", title: "The Modernity", desc: "The introduction of 360-degree craftsmanship and digital authentication. Beauty meeting innovation." }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-12 group">
                    <span className="text-sm font-serif italic text-neutral-400 group-hover:text-black transition-colors">{item.year}</span>
                    <div>
                      <h3 className="uppercase tracking-[0.3em] text-[12px] font-bold mb-4">{item.title}</h3>
                      <p className="text-[11px] uppercase tracking-widest leading-loose text-neutral-500 max-w-md">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission & Values: Border-boxed */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 space-y-px bg-black border border-black">
                {[
                  { title: "Mission", desc: "To empower the modern woman with hair that enhances her silhouette and withstands the passage of time." },
                  { title: "Vision", desc: "To remain Africa's most trusted arbiter of luxury hair, recognized for unparalleled customer discretion." },
                  { title: "Ethos", desc: "Quality as a prerequisite. Transparency as a foundation. Innovation as a tradition." }
                ].map((box, i) => (
                  <div key={i} className="bg-white p-10 md:p-12">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-6 text-neutral-400">{box.title}</h3>
                    <p className="text-[12px] uppercase tracking-[0.15em] leading-[2]">{box.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Founder Section: Grayscale Editorial */}
          <section className="py-24 border-t border-black/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
              <div className="aspect-[4/5] bg-neutral-100 grayscale contrast-125 overflow-hidden border border-black/5">
                <img 
                  src="/images/founder.jpg" 
                  alt="Chinwe Okoro" 
                  className="w-full h-full object-cover mix-blend-multiply opacity-90"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 mb-6 block">The Visionary</span>
                <h2 className="text-3xl uppercase tracking-tighter font-light mb-8">Chinwe Okoro</h2>
                <blockquote className="text-lg font-serif italic leading-relaxed text-neutral-700 mb-10">
                  "I believe Nigerian women deserve hair that is an investment, not a temporary fix. Seeing that confidence returned is our true measure of success."
                </blockquote>
                <div className="flex gap-8">
                  <a href={siteConfig.social.instagram} className="text-[9px] uppercase tracking-[0.3em] border-b border-black/20 hover:border-black transition-all">Instagram</a>
                  <a href={`https://wa.me/${siteConfig.business.whatsapp}`} className="text-[9px] uppercase tracking-[0.3em] border-b border-black/20 hover:border-black transition-all">WhatsApp</a>
                </div>
              </div>
            </div>
          </section>

          {/* Quality Promise: Stark Contrast */}
          <section className="bg-black text-white py-24 md:py-32 px-10 text-center -mx-6 md:-mx-20 lg:-mx-32">
             <h2 className="text-2xl md:text-4xl uppercase tracking-[0.3em] font-light mb-16 italic font-serif">La Promesse de Qualité</h2>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
                {[
                  { label: "100% Human", sub: "Selection" },
                  { label: "Bleach-Ready", sub: "Integrity" },
                  { label: "12 Month", sub: "Assurance" },
                  { label: "Seven Stage", sub: "Verification" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-8 h-[1px] bg-white/30 mb-6"></div>
                    <span className="text-[11px] uppercase tracking-[0.4em] font-bold mb-2">{stat.label}</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">{stat.sub}</span>
                  </div>
                ))}
             </div>
          </section>

          {/* CTA: Ultra Minimal */}
          <div className="py-32 text-center">
            <h2 className="text-2xl md:text-3xl uppercase tracking-[0.4em] mb-12 font-extralight">Join the Maison</h2>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <a href="/shop" className="px-16 py-4 bg-black text-white uppercase tracking-[0.3em] text-[10px] hover:bg-neutral-800 transition-all">
                Shop Collection
              </a>
              <a href={`https://wa.me/${siteConfig.business.whatsapp}`} className="px-16 py-4 border border-black uppercase tracking-[0.3em] text-[10px] hover:bg-black hover:text-white transition-all">
                The Private Suite
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Branding */}
      <footer className="py-20 border-t border-black/5 text-center">
        <div className="w-10 h-[1px] bg-black mx-auto mb-8"></div>
        <p className="text-[9px] uppercase tracking-[0.6em] text-neutral-400">Maison de Beauté — Lagos</p>
      </footer>
    </div>
  );
};

export default About;