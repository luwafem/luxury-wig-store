import QRCode from 'react-qr-code';

export const qrCodeService = {
  generateProductQR(productId) {
    const url = `${window.location.origin}/product/${productId}`;
    return (
      <div id={`product-qr-${productId}`}>
        <QRCode
          value={url}
          size={128}
          level="H"
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
    );
  },
  
  generateOrderQR(orderId) {
    const url = `${window.location.origin}/order/${orderId}`;
    return (
      <div id={`order-qr-${orderId}`}>
        <QRCode
          value={url}
          size={128}
          level="H"
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
    );
  },
  
  downloadQR(elementId, filename = 'qrcode.png') {
    const svg = document.getElementById(elementId).querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = filename;
      downloadLink.href = pngFile;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  },
};