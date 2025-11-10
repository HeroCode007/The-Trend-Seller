export const metadata = {
  title: 'About Us | The Trend Seller Pakistan',
  description:
    'Discover The Trend Seller Pakistan — your destination for premium watches, genuine leather wallets, and stylish accessories that define modern Pakistani fashion.',
  openGraph: {
    title: 'About Us | The Trend Seller Pakistan',
    description:
      'Discover The Trend Seller Pakistan — your destination for premium watches, genuine leather wallets, and stylish accessories that define modern Pakistani fashion.',
  },
};

export default function AboutPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-8 text-center">
          About <span className="text-amber-600">The Trend Seller</span>
        </h1>

        <div className="prose prose-lg max-w-none text-neutral-700">
          <section className="mb-12 text-center">
            <p className="leading-relaxed text-lg">
              <strong>The Trend Seller</strong> is Pakistan’s go-to destination for
              <strong> premium and stylish fashion</strong> that combine
              timeless craftsmanship with modern aesthetics. Based in Pakistan, our brand blends
              international design trends with the refined taste of the local fashion scene.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Our Story
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Founded with a vision to make luxury accessible in Pakistan, The Trend Seller was built
              on a simple idea — everyone deserves to own premium-quality accessories without paying
              sky-high prices. What started as a small passion project soon grew into a trusted name
              for stylish men across Pakistan.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Each product in our collection reflects careful attention to detail, from the stitching
              of a leather belt to the polish of a steel watch. We collaborate with expert
              manufacturers and trusted suppliers to bring you quality you can feel — and style that
              lasts.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Quality & Authenticity
                </h3>
                <p className="text-neutral-600">
                  Every piece is crafted with premium materials — from stainless steel and genuine
                  leather to durable watch mechanisms. We never compromise on authenticity and quality.
                </p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Modern Pakistani Style
                </h3>
                <p className="text-neutral-600">
                  Our designs reflect the vibrant, confident, and modern fashion sense of Pakistan —
                  elegant yet practical, bold yet timeless.
                </p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Customer-Centered Approach
                </h3>
                <p className="text-neutral-600">
                  We build trust through excellent service, responsive communication, and smooth
                  delivery — because our customers deserve the best at every step.
                </p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Affordable Luxury
                </h3>
                <p className="text-neutral-600">
                  Luxury doesn’t have to be overpriced. We keep our pricing fair and transparent,
                  making premium fashion accessible to everyone in Pakistan.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Our Commitment
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              All over Pakistan, our goal is to bring world-class quality and style right to
              your doorstep. Every product goes through careful quality checks before it reaches you.
              Whether it’s a watch that completes your business look or a wallet that speaks elegance,
              we promise durability, comfort, and design excellence.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              We take pride in being a Pakistani brand with global standards — serving customers who
              value sophistication, reliability, and authenticity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Why Shop With The Trend Seller?
            </h2>
            <ul className="space-y-3 text-neutral-600">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">•</span>
                <span>Premium quality products with elegant packaging</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">•</span>
                <span>Nationwide delivery across Pakistan</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">•</span>
                <span>Cash on Delivery and secure online payment options</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">•</span>
                <span>Hassle-free exchanges and returns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">•</span>
                <span>Friendly customer support via WhatsApp & Email</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
