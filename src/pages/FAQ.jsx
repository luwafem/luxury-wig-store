import React, { useState } from 'react';
import SEO from '../components/common/SEO';
import Button from '../components/common/Button';
import { siteConfig } from '../config/siteConfig'; // Added this import
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Is the hair 100% human hair?',
      answer: 'Yes, all our wigs and extensions are made from 100% premium quality human hair. We source our hair from the finest donors and process it to maintain its natural texture, luster, and durability.'
    },
    {
      question: 'Can the hair be dyed or bleached?',
      answer: 'Absolutely! Our hair is 100% virgin human hair, which means it has not been chemically processed. You can safely dye, bleach, or color the hair to your desired shade. However, we recommend consulting a professional stylist for best results.'
    },
    {
      question: 'How long does the hair last?',
      answer: 'With proper care and maintenance, our wigs can last 1-2 years or even longer. The longevity depends on how often you wear it, your maintenance routine, and how you style it. We provide a detailed care guide with every purchase.'
    },
    {
      question: 'Do you offer installation services?',
      answer: 'Yes, we partner with professional stylists across major cities in Nigeria. You can book an installation appointment through our WhatsApp support. We also provide detailed installation tutorials on our Instagram page.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for unused items in their original packaging. Custom wigs and installed items are non-returnable. Please see our Returns & Exchanges page for complete details.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Lagos: 1-2 business days. Other states: 3-5 business days. International: 7-14 business days. We provide tracking information for all orders.'
    },
    {
      question: 'Can I swim or exercise with the wig?',
      answer: 'Yes, our wigs are durable and can withstand water and sweat. However, we recommend wearing a swim cap for chlorine pools and properly washing and conditioning the hair after exposure to saltwater or chlorine.'
    },
    {
      question: 'Do you offer wholesale prices?',
      answer: 'Yes, we offer wholesale pricing for salon owners and resellers. Contact our WhatsApp business line for wholesale inquiries and pricing.'
    },
    {
      question: 'How do I maintain and wash the wig?',
      answer: 'We recommend washing with sulfate-free shampoo and conditioner every 10-14 wears. Use wide-tooth combs, avoid excessive heat, and store on a wig stand when not in use. Full care instructions are provided with your order.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Paystack payments (cards & bank transfers), bank transfers, and cash on delivery (Lagos only). All payments are secure and encrypted.'
    }
  ];

  return (
    <>
      <SEO 
        title="Frequently Asked Questions" 
        description="Get answers to common questions about our wigs, hair quality, installation, maintenance, delivery, and more."
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-lg">
              Find answers to common questions about our products and services
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-lg">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 border-t">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-12 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our customer support team is ready to help you with any additional questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${siteConfig.business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <span className="mr-2">💬</span>
                WhatsApp Support
              </a>
              <a
                href={`mailto:${siteConfig.business.email}`}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
              >
                <span className="mr-2">✉️</span>
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;