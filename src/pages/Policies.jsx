import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
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
          content: `By accessing and using LuxuryLocks Nigeria's website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website.`
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

  return (
    <>
      <SEO 
        title={currentPolicy.title}
        description={`Read our ${currentPolicy.title.toLowerCase()} for LuxuryLocks Nigeria.`}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Policy Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(policies).map((key) => (
                <button
                  key={key}
                  onClick={() => setActivePolicy(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activePolicy === key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {policies[key].title}
                </button>
              ))}
            </div>
          </div>

          {/* Policy Content */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-luxury-rose text-white p-8">
              <h1 className="text-3xl font-display font-bold mb-2">
                {currentPolicy.title}
              </h1>
              <p className="text-primary-100">
                Last Updated: {currentPolicy.lastUpdated}
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-8">
                  Welcome to LuxuryLocks Nigeria. This policy outlines our practices regarding 
                  {activePolicy === 'privacy' && ' the collection, use, and protection of your personal information.'}
                  {activePolicy === 'terms' && ' your use of our website and services.'}
                  {activePolicy === 'refund' && ' our refund procedures and policies.'}
                  {activePolicy === 'delivery' && ' our delivery services and timelines.'}
                  {activePolicy === 'return' && ' our return and exchange procedures.'}
                </p>

                {currentPolicy.sections.map((section, index) => (
                  <div key={index} className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <div className="text-gray-600 whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                ))}

                {/* Contact Section */}
                <div className="mt-12 pt-8 border-t">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Contact Us
                  </h2>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about this policy, please contact us:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">Email:</p>
                      <p className="text-gray-600">{siteConfig.business.email}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Phone/WhatsApp:</p>
                      <p className="text-gray-600">{siteConfig.business.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-semibold text-gray-900">Address:</p>
                      <p className="text-gray-600">{siteConfig.business.address}</p>
                    </div>
                  </div>
                </div>

                {/* Acknowledgment */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    By using our website and services, you acknowledge that you have read, 
                    understood, and agree to be bound by this policy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/faq"
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <span className="text-2xl mb-2 block">❓</span>
              <h3 className="font-semibold text-gray-900">FAQs</h3>
              <p className="text-sm text-gray-600">Find quick answers</p>
            </Link>
            
            <Link
              to="/contact"
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <span className="text-2xl mb-2 block">📞</span>
              <h3 className="font-semibold text-gray-900">Contact Support</h3>
              <p className="text-sm text-gray-600">Need help? Contact us</p>
            </Link>
            
            <a
              href={`https://wa.me/${siteConfig.business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <span className="text-2xl mb-2 block">💬</span>
              <h3 className="font-semibold text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-600">Chat on WhatsApp</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Policies;