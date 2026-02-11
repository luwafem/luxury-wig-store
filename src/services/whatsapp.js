import { siteConfig } from '../config/siteConfig';

export const whatsappService = {
  sendProductInquiry(product) {
    const message = `Hello! I'm interested in your product:\n\n*${product.name}*\nProduct Code: ${product.productCode}\nPrice: ₦${product.price.toLocaleString()}\n\nCould you provide more details?`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${siteConfig.business.whatsapp}?text=${encodedMessage}`;
  },
  
  sendOrderInquiry(order) {
    const message = `Hello! I have a question about my order:\n\n*Order ID:* ${order.id}\n*Date:* ${new Date(order.createdAt).toLocaleDateString()}\n*Total:* ₦${order.totalAmount.toLocaleString()}\n\nPlease assist me.`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${siteConfig.business.whatsapp}?text=${encodedMessage}`;
  },
  
  sendSupportMessage() {
    const message = `Hello mamusca Nigeria! I need assistance with:`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${siteConfig.business.whatsapp}?text=${encodedMessage}`;
  },
};