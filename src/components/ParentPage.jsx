// ParentPage.jsx
import React, { useState, useEffect } from "react";
import MobilePm from "./Screen/MobilePm";
import { makeIOSWhatsAppUrl } from "./iosWhatsappLink";

export default function ParentPage() {
  const [whatsappUrl, setWhatsappUrl] = useState("#");
const isIOS =
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    // Called from MobilePm: updates the URL for the button
    window.pmUpdateLink = (phone, message) => {
      const url = makeIOSWhatsAppUrl(phone, message);
      setWhatsappUrl(url);
    };

    // Direct href setter (iOS)
    window.pmSetWhatsappLinkHref = function (url) {
      const a = document.getElementById("pm-whatsapp-link");
      if (a) a.href = url;
    };

    // iOS fallback (iframe)
    window.pmIOSOpen = function (url) {
      const frame = document.getElementById("whatsapp-ios-fallback");
      if (frame) frame.src = url;
    };
  }, []);

  return (
    <div>
      {/* Parent WhatsApp button - ONLY for iPhone */}
    {isIOS && (
      <>
        <iframe id="whatsapp-ios-fallback" style={{ display: "none" }}></iframe>

        <a
          id="pm-whatsapp-link"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ width: "100%", display: "block", marginBottom: "1rem" }}
        >
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Send Selected via WhatsApp
          </button>
        </a>
      </>
    )}

      {/* Your original component */}
      <MobilePm />
    </div>
  );
}
