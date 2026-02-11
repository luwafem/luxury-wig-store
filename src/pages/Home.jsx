import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import ProductGrid from '../components/products/ProductGrid';
import { siteConfig } from '../config/siteConfig';
import { productService } from '../services/firebase';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [featured, bestSelling] = await Promise.all([
        productService.getFeaturedProducts(8),
        productService.getBestSellers(8),
      ]);
      setFeaturedProducts(featured || []);
      setBestSellers(bestSelling || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black antialiased">
      <SEO />
      
      {/* Hero Section: Minimalist Impact */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden border-b border-black/5">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/6923225/pexels-photo-6923225.jpeg?cs=srgb&dl=pexels-rdne-6923225.jpg&fm=jpg&w=6623&h=4415"
            alt="Editorial"
            className="w-full h-full object-cover grayscale brightness-[0.80] contrast-110"
          />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <span className="block uppercase tracking-[0.6em] text-[10px] md:text-xs mb-6 font-sans font-medium text-white">
              Spring-Summer 2026
            </span>
            <h1 className="text-5xl md:text-8xl font-light uppercase tracking-tighter leading-none mb-10 text-white">
              L'Art de <br /> la Coiffure
            </h1>
            <Link to="/shop">
              <button className="px-10 py-4 bg-white text-black uppercase tracking-[0.3em] text-[10px] hover:bg-neutral-800 transition-all duration-500">
                Explore the Collection
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* House Values: Hairline Borders for Mobile */}
      <section className="bg-white border-b border-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black">
            {[
              { label: "The Delivery", desc: "Complimentary over ₦50,000" },
              { label: "The Quality", desc: "100% Virgin Selection" },
              { label: "The Promise", desc: "Twelve Month Guarantee" }
            ].map((item, i) => (
              <div key={i} className="py-10 text-center flex flex-col items-center justify-center px-4">
                <h3 className="uppercase tracking-[0.4em] text-[11px] font-bold mb-2">{item.label}</h3>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured: Asymmetric spacing */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16 md:mb-24">
            <h2 className="text-2xl md:text-4xl uppercase tracking-[0.3em] font-light mb-4">The Selection</h2>
            <div className="w-10 h-[1px] bg-black"></div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-5 h-5 border-t border-black rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-16">
              <ProductGrid products={featuredProducts} showFilters={false} />
              <div className="flex justify-center pt-8">
                <Link to="/shop" className="group flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-[0.5em] mb-2 group-hover:text-neutral-500 transition-colors">View All</span>
                  <div className="w-16 h-[1px] bg-black/20 group-hover:bg-black transition-all"></div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers: Contrast Section */}
      <section className="py-20 bg-[#f9f9f9]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-3xl uppercase tracking-[0.4em] mb-12 italic font-serif">Les Iconiques</h2>
          <ProductGrid products={bestSellers} showFilters={false} />
        </div>
      </section>

      {/* Boutique CTA: Ultra Minimal */}
      <section className="py-24 md:py-40 bg-white border-t border-black/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-4xl uppercase tracking-[0.4em] mb-8 font-extralight">The Private Suite</h2>
          <p className="max-w-md mx-auto text-[10px] md:text-xs uppercase tracking-[0.25em] leading-[2.5] text-neutral-500 mb-12">
            Experience personalized luxury. Our specialists are available for digital consultations and bespoke requests.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <a 
              href={`https://wa.me/${siteConfig.business.whatsapp}`}
              className="w-full md:w-auto px-12 py-4 border border-black uppercase tracking-[0.3em] text-[10px] hover:bg-black hover:text-white transition-all duration-700"
            >
              Contact a Specialist
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;