import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { siteConfig } from '../../config/siteConfig';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Navigation",
      links: [
        { label: "The Shop", path: "/shop" },
        { label: "Our Story", path: "/about" },
        { label: "Journal", path: "/journal" },
        { label: "Contact", path: "/contact" }
      ]
    },
    {
      title: "Assistance",
      links: [
        { label: "Shipping & Returns", path: "/policies?type=delivery" },
        { label: "Care Guide", path: "/care" },
        { label: "Privacy", path: "/policies?type=privacy" },
        { label: "Terms", path: "/policies?type=terms" }
      ]
    }
  ];

  return (
    <footer className="bg-white border-t border-black/5 pt-24 pb-12 antialiased">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand Essence - 5 Columns */}
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="inline-block group">
              <h2 className="text-2xl font-light uppercase tracking-[0.3em]">
                {siteConfig.brandName}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 mt-2">
                enterprise
              </p>
            </Link>
            <p className="text-sm font-light leading-relaxed text-neutral-500 max-w-sm">
              Crafting premium 100% human hair architecture for the modern woman. 
              A synthesis of luxury, heritage, and contemporary art.
            </p>
            <div className="flex space-x-6">
              {['Instagram', 'Facebook', 'WhatsApp'].map((social) => (
                <a 
                  key={social}
                  href={siteConfig.social[social.toLowerCase()]}
                  className="text-[10px] uppercase tracking-[0.2em] text-black hover:text-neutral-400 transition-colors"
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
                <h3 className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        to={link.path} 
                        className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 hover:text-black transition-colors"
                      >
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
            <h3 className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-6">
              Newsletter
            </h3>
            <form className="relative group">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-transparent border-b border-neutral-200 py-3 text-[10px] tracking-widest focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest font-medium hover:italic"
              >
                Join
              </button>
            </form>
            <p className="text-[9px] text-neutral-400 mt-4 leading-relaxed tracking-wider">
              BY SUBSCRIBING YOU AGREE TO OUR PRIVACY POLICY.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Ultra Clean */}
        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-[10px] tracking-[0.2em] text-neutral-400">
            &copy; {currentYear} {siteConfig.brandName.toUpperCase()} — ALL RIGHTS RESERVED.
          </span>
          
          <div className="flex items-center space-x-8 opacity-40 grayscale hover:opacity-100 transition-opacity duration-700">
            <img 
              src="https://www.paystack.com/assets/img/logos/paystack-logo-white.png" 
              alt="Paystack" 
              className="h-4 invert" // Inverting since Paystack white logo on white bg
            />
            <span className="text-[10px] tracking-widest text-black">SECURE CHECKOUT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;