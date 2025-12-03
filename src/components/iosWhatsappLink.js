// iosWhatsappLink.js
export function makeIOSWhatsAppUrl(phone, msg) {
  const encoded = encodeURIComponent(msg);
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
}
