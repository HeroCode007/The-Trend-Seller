"use client";

export default function ContactForm() {
    const handleSubmit = (e) => {
        e.preventDefault();

        const name = e.target.name.value.trim();
        const email = e.target.email.value.trim();
        const subject = e.target.subject.value.trim();
        const message = e.target.message.value.trim();

        const whatsappMessage = `Hello! 👋%0AMy name is ${name}.%0AEmail: ${email}%0ASubject: ${subject}%0AMessage: ${message}`;
        const phoneNumber = "923227032219"; // your WhatsApp number
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        const whatsappURL = isMobile
            ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${whatsappMessage}`
            : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${whatsappMessage}`;

        window.open(whatsappURL, "_blank");
        e.target.reset();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-900 mb-2">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-shadow"
                    placeholder="Your name"
                    required
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-shadow"
                    placeholder="your@email.com"
                    required
                />
            </div>

            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-900 mb-2">
                    Subject
                </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-shadow"
                    placeholder="How can we help?"
                    required
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-900 mb-2">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-shadow resize-none"
                    placeholder="Your message..."
                    required
                ></textarea>
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
                Send via WhatsApp
            </button>
        </form>
    );
}
