"use client";

import { MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/contact";

const DEFAULT_MESSAGE = encodeURIComponent(
  "Good day, Eyabantu Funerals — I would like assistance with a funeral or policy enquiry.",
);

export function WhatsAppFloat() {
  const href = `https://wa.me/${CONTACT.whatsappE164}?text=${DEFAULT_MESSAGE}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 ring-2 ring-white/90 transition hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      aria-label="Chat on WhatsApp"
      title="WhatsApp Eyabantu Funerals"
    >
      <MessageCircle className="h-7 w-7" aria-hidden />
    </a>
  );
}

