import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import { siteConfig } from '../config/siteConfig';

const Policies = () => {
  const location = useLocation();
  const [activePolicy, setActivePolicy] = useState('privacy');
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const policyType = params.get('type');
    if (policyType) {
      setActivePolicy(policyType);
    }
  }, [location]);

  const policies = {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'January 1, 2024',
      sections: [
        {
          title: 'Information We Collect',
          content: `We collect information you provide directly to us, including:
• Name, email address, phone number, and delivery address when you place an order
• Payment information (processed securely by Paystack)
• Communication preferences
• Product reviews and feedback`
        },
        {
          title: 'How We Use Your Information',
          content: `We use the information we collect to:
• Process and fulfill your orders
• Communicate with you about orders, products, and promotions
• Improve our website and customer service
• Send marketing communications (with your consent)
• Prevent fraudulent transactions`
        },
        {
          title: 'Data Security',
          content: `We implement appropriate technical and organizational security measures to protect your personal information. All payment transactions are encrypted using SSL technology and processed by Paystack, a PCI-DSS compliant payment processor.`
        },
        {
          title: 'Your Rights',
          content: `You have the right to:
• Access your personal information
• Correct inaccurate information
• Request deletion of your information
• Opt-out of marketing communications
• Withdraw consent at any time`
        }
      ]
    },
    terms: {
      title: 'Terms & Conditions',
      lastUpdated: 'January 1, 2024',
      sections: [
        {
          title: 'Acceptance of Terms',
          content: `By accessing and using mamusca Nigeria's website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website.`
        },
        {
          title: 'Product Information',
          content: `We strive to accurately display product colors and images, but actual colors may vary. Product descriptions are for informational purposes only. We reserve the right to modify product specifications without prior notice.`
        },
        {
          title: 'Pricing and Payment',
          content: `All prices are in Nigerian Naira (₦). We reserve the right to change prices without notice. Payment must be made in full before order processing. We accept Paystack (cards & bank transfers), bank transfers, and cash on delivery (Lagos only).`
        },
        {
          title: 'Order Acceptance',
          content: `Your order constitutes an offer to purchase. We reserve the right to refuse or cancel any order for any reason, including:
• Product unavailability
• Pricing errors
• Suspicious or fraudulent activity
• Incorrect delivery information`
        }
      ]
    },
    refund: {
      title: 'Refund Policy',
      lastUpdated: 'January 1, 2024',
      sections: [
        {
          title: 'Refund Eligibility',
          content: `We accept returns and provide refunds under the following conditions:
• Items must be returned within 7 days of delivery
• Products must be unused, uninstalled, and in original packaging
• All tags and labels must be intact
• Custom-made wigs and installed items are non-refundable`
        },
        {
          title: 'Refund Process',
          content: `To initiate a return:
1. Contact our customer service via WhatsApp or email
2. Provide order number and reason for return
3. Receive return authorization and instructions
4. Ship the item back to us
5. Once received and inspected, we'll process your refund within 5-7 business days`
        },
        {
          title: 'Refund Methods',
          content: `Refunds will be issued to the original payment method:
• Paystack/card payments: Refunded to original card (5-10 business days)
• Bank transfer: Refunded to bank account (1-3 business days)
• Cash on delivery: Bank transfer refund`
        }
      ]
    },
    delivery: {
      title: 'Delivery Policy',
      lastUpdated: 'January 1, 2024',
      sections: [
        {
          title: 'Delivery Areas & Timelines',
          content: `We deliver across Nigeria with the following estimated timelines:
• Lagos: 1-2 business days
• Other States: 3-5 business days
• International: 7-14 business days (additional charges apply)

Delivery times are estimates and may vary due to external factors.`
        },
        {
          title: 'Shipping Costs',
          content: `• Lagos: ₦2,500 (Free on orders above ₦50,000)
• Other States: ₦3,500 (Free on orders above ₦100,000)
• International: Calculated at checkout based on destination

Shipping costs are non-refundable unless the return is due to our error.`
        },
        {
          title: 'Order Tracking',
          content: `Once your order is shipped, we'll provide tracking information via email and WhatsApp. You can track your package using the provided tracking number on the courier's website.`
        }
      ]
    },
    return: {
      title: 'Return & Exchange Policy',
      lastUpdated: 'January 1, 2024',
      sections: [
        {
          title: 'Return Conditions',
          content: `We accept returns for:
• Defective or damaged items
• Incorrect items shipped
• Size/color mismatch (unused items only)
• Change of mind (unused items within 7 days)

Items must be in original condition with all packaging and tags.`
        },
        {
          title: 'Exchange Process',
          content: `To exchange an item:
1. Contact us within 7 days of delivery
2. We'll arrange pickup or provide return address
3. Once received, we'll ship the replacement
4. You'll be responsible for return shipping unless it's our error

Exchanges are subject to product availability.`
        },
        {
          title: 'Damaged or Defective Items',
          content: `If you receive a damaged or defective item:
1. Contact us within 48 hours of delivery
2. Provide photos/videos of the issue
3. We'll arrange pickup and replacement at no cost to you
4. Full refund available if replacement is not possible`
        }
      ]
    }
  };

  const currentPolicy = policies[activePolicy];

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
      const isMobile = window.innerWidth < 768;
      const total = isMobile
        ? Math.floor(Math.random() * 5) + 3   // 3–8
        : Math.floor(Math.random() * 7) + 5; // 5–12
      
      const leftCount = Math.ceil(total / 2);
      const rightCount = Math.floor(total / 2);
      
      const minSize = isMobile ? 24 : 32;
      const maxSize = isMobile ? 54 : 84;
      
      const newElements = [];

      for (let i = 0; i < leftCount; i++) {
        newElements.push({
          id: `POLICY-L-${i}`,
          x: Math.random() * 15,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.5,
          color: `rgba(236, 72, 153, ${Math.random() * 0.4 + 0.5})`,
          delay: i * 0.15,
        });
      }

      for (let i = 0; i < rightCount; i++) {
        newElements.push({
          id: `POLICY-R-${i}`,
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
    <>
      <SEO 
        title={currentPolicy.title}
        description={`Read our ${currentPolicy.title.toLowerCase()} for mamusca Nigeria.`}
      />
      
      <div className="bg-black text-white antialiased min-h-screen relative overflow-hidden">
        {/* ✦ PERFECT HEARTS – LEFT & RIGHT EDGES ONLY ✦ */}
        <DecorativeElements />

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            
            {/* Editorial Header */}
            <header className="text-center mb-16 border-b border-white/5 pb-12">
              
              <h1 className="text-4xl md:text-5xl uppercase tracking-tighter font-light leading-none text-white">
                Policies
              </h1>
            </header>

            {/* Policy Navigation – Minimal Pink Underline */}
            <div className="mb-12 overflow-x-auto">
              <div className="flex items-center space-x-8 md:space-x-12 pb-2 no-scrollbar">
                {Object.keys(policies).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActivePolicy(key)}
                    className={`uppercase tracking-[0.3em] text-[10px] whitespace-nowrap py-2 transition-colors relative ${
                      activePolicy === key
                        ? 'text-white font-medium after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-pink-400'
                        : 'text-neutral-500 hover:text-pink-300'
                    }`}
                  >
                    {policies[key].title}
                  </button>
                ))}
              </div>
            </div>

            {/* Policy Content Card – Noir */}
            <motion.div
              key={activePolicy}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-black/80 backdrop-blur-sm border border-white/5"
            >
              {/* Header – Pink Accent */}
              <div className="border-b border-white/5 p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-light uppercase tracking-tighter text-white mb-2">
                      {currentPolicy.title}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-[1px] bg-pink-400/50" />
                      <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">
                        Last Updated: {currentPolicy.lastUpdated}
                      </span>
                    </div>
                  </div>
                  <span className="text-pink-400/60 text-[8px] uppercase tracking-[0.6em] font-serif italic">
                    mamusca
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-neutral-400 text-xs uppercase tracking-[0.2em] leading-loose mb-12">
                    {activePolicy === 'privacy' && 'The collection, use, and protection of your personal information.'}
                    {activePolicy === 'terms' && 'Your use of our website and services.'}
                    {activePolicy === 'refund' && 'Our refund procedures and policies.'}
                    {activePolicy === 'delivery' && 'Our delivery services and timelines.'}
                    {activePolicy === 'return' && 'Our return and exchange procedures.'}
                  </p>

                  {currentPolicy.sections.map((section, index) => (
                    <div key={index} className="mb-12 last:mb-0">
                      <h3 className="text-pink-400 text-[11px] uppercase tracking-[0.5em] font-medium mb-6 flex items-center">
                        <span className="mr-4 text-white/40 font-serif italic text-sm">0{index + 1}</span>
                        {section.title}
                      </h3>
                      <div className="text-[12px] text-neutral-300 leading-[2] uppercase tracking-[0.15em] whitespace-pre-line font-light">
                        {section.content}
                      </div>
                    </div>
                  ))}

                  {/* Contact Section – Noir */}
                  <div className="mt-16 pt-12 border-t border-white/5">
                    <h3 className="text-pink-400 text-[11px] uppercase tracking-[0.5em] font-medium mb-8 flex items-center">
                      <span className="mr-4 text-white/40 font-serif italic text-sm">—</span>
                      Contact Us
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="border border-white/5 p-6 bg-black/40">
                        <p className="text-[8px] uppercase tracking-[0.4em] text-neutral-500 mb-2">Email</p>
                        <p className="text-[11px] uppercase tracking-wider text-white/90">{siteConfig.business.email}</p>
                      </div>
                      <div className="border border-white/5 p-6 bg-black/40">
                        <p className="text-[8px] uppercase tracking-[0.4em] text-neutral-500 mb-2">Phone/WhatsApp</p>
                        <p className="text-[11px] uppercase tracking-wider text-white/90">{siteConfig.business.phone}</p>
                      </div>
                      <div className="md:col-span-2 border border-white/5 p-6 bg-black/40">
                        <p className="text-[8px] uppercase tracking-[0.4em] text-neutral-500 mb-2">Address</p>
                        <p className="text-[11px] uppercase tracking-wider text-white/90">{siteConfig.business.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Acknowledgment */}
                  <div className="mt-12 p-8 border border-pink-400/20 bg-black/40">
                    <div className="flex items-start gap-4">
                      <span className="text-pink-400 text-xl font-serif italic">“</span>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 leading-relaxed">
                        By using our website and services, you acknowledge that you have read, 
                        understood, and agree to be bound by this policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Links – Noir Cards with Magnetic Buttons */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/faq"
                className="group relative p-8 border border-white/5 bg-black/60 hover:border-pink-400/30 transition-all duration-500 text-center"
              >
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white mb-2">FAQs</h3>
                <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-500">Find quick answers</p>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-pink-400/0 group-hover:bg-pink-400/50 transition-all duration-500" />
              </Link>
              
              <Link
                to="/contact"
                className="group relative p-8 border border-white/5 bg-black/60 hover:border-pink-400/30 transition-all duration-500 text-center"
              >
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white mb-2">Contact Support</h3>
                <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-500">Need help? Contact us</p>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-pink-400/0 group-hover:bg-pink-400/50 transition-all duration-500" />
              </Link>
              
              <a
                href={`https://wa.me/${siteConfig.business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-8 border border-white/5 bg-black/60 hover:border-pink-400/30 transition-all duration-500 text-center"
              >
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white mb-2">Live Chat</h3>
                <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-500">Chat on WhatsApp</p>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-pink-400/0 group-hover:bg-pink-400/50 transition-all duration-500" />
              </a>
            </div>

            {/* Footer Branding */}
            <footer className="mt-20 pt-12 border-t border-white/5 text-center">
              <div className="w-10 h-[1px] bg-pink-500/30 mx-auto mb-8" />
              <p className="text-[9px] uppercase tracking-[0.6em] text-neutral-600">
                {siteConfig.brandName} — Legal Archive
              </p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Policies;