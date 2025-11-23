import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with The Trend Seller. We're here to help with questions about our watches, belts, wallets, or your order.",
  openGraph: {
    title: "Contact Us | The Trend Seller",
    description:
      "Get in touch with The Trend Seller. We're here to help with questions about our watches, belts, wallets, or your order.",
  },
};

export default function ContactPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-neutral-600 mb-12">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Get in Touch
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                  <a
                    href="mailto:thetrendseller0@gmail.com"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    thetrendseller0@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Phone</h3>
                  <ul className="text-neutral-600 space-y-1">
                    <li>
                      <a href="tel:0315-6120078" className="hover:text-neutral-900">
                        0315-6120078
                      </a>
                    </li>
                    <li>
                      <a href="tel:0340-3928909" className="hover:text-neutral-900">
                        0340-3928909
                      </a>
                    </li>
                    <li>
                      <a href="tel:0323-4653567" className="hover:text-neutral-900">
                        0323-4653567
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Address</h3>
                  <address className="text-neutral-600 not-italic">
                    Sialkot
                    <br />
                    Pakistan
                  </address>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ WhatsApp Form (client component) */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
