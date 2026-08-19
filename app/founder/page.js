import Link from 'next/link';
import { Heart, Rocket, Star, TrendingUp, Award, ArrowRight, Search, Wrench } from 'lucide-react';

export const metadata = {
  title: 'Founder Story | The Trend Seller Pakistan',
  description:
    'Meet Syed Saif Ali and Syed Irfan Shah, the founders behind The Trend Seller. From a year of market research to an officially launched, revenue generating brand. The real story.',
  openGraph: {
    title: 'Founder Story | The Trend Seller Pakistan',
    description:
      'Meet Syed Saif Ali and Syed Irfan Shah, the founders behind The Trend Seller. From a year of market research to an officially launched, revenue generating brand. The real story.',
  },
};

const milestones = [
  {
    period: 'December 2024',
    title: 'The Research Begins',
    description:
      'Before writing a single line of code or listing a single product, months were spent studying the market. What were customers complaining about? Where were sellers failing? What did Pakistan\'s accessories market actually need? The goal was to understand the problems deeply before building anything.',
    icon: Search,
  },
  {
    period: 'Early to Mid 2025',
    title: 'Finding the Gaps',
    description:
      'The research revealed clear patterns: unreliable sellers, poor product quality, zero brand trust, and a complete lack of a premium but affordable experience. Most online sellers were treating customers like a transaction. The opportunity was clear. Build something different. A brand people could actually trust.',
    icon: TrendingUp,
  },
  {
    period: 'Mid to Late 2025',
    title: 'Building the Brand',
    description:
      'With the problems clearly defined, we started building. The website, the product curation, the branding, the logistics. Everything was designed from the ground up with the customer in mind. No shortcuts. Every decision was deliberate.',
    icon: Wrench,
  },
  {
    period: '24th November 2025',
    title: 'Official Launch',
    description:
      'The Trend Seller went live officially on 24th November 2025. A year of preparation, research, and building had all led to this moment. The first collection of premium watches, genuine leather wallets, and quality belts was live and ready for Pakistan.',
    icon: Rocket,
  },
  {
    period: 'December 2025 to February 2026',
    title: 'First Real Customers',
    description:
      'The first orders started coming in from real people who found us, trusted us, and bought. Every order in those early months was packed personally and sent with full care. Each one felt like proof that the year of preparation was worth it.',
    icon: Heart,
  },
  {
    period: 'March to June 2026',
    title: 'A Running Revenue Generating Business',
    description:
      'By mid 2026, The Trend Seller had grown into a fully operational, revenue generating business. Repeat customers, growing reviews, an expanding catalog, and a brand that people across Pakistan were beginning to recognize and trust.',
    icon: Award,
  },
];

export default function FounderPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4">
            The Story Behind The Brand
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            One Year of Research.
            <br />
            <span className="text-amber-500">One Decision to Build.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            The Trend Seller did not start with luck. It started in December 2024 with
            a question and the discipline to find the answer before acting on it.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-amber-400 font-semibold text-lg">
            <span>Syed Saif Ali, Founder</span>
            <span className="hidden sm:block text-neutral-600">·</span>
            <span>Syed Irfan Shah, Co Founder</span>
          </div>
        </div>
      </section>

      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Personal Intro */}
          <section className="mb-16">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 md:p-10">
              <blockquote className="text-xl md:text-2xl text-neutral-800 font-medium leading-relaxed italic mb-6">
                "We did not start building until we understood exactly what we were solving.
                That patience, doing the work before the launch, is what made the difference."
              </blockquote>
              <p className="text-neutral-600 leading-relaxed text-lg mb-4">
                The Trend Seller was built by two people with a shared conviction. In December 2024,
                Syed Saif Ali began analyzing the accessories market in Pakistan. Not to start a
                brand immediately, but to understand it deeply first. What problems existed? Why
                were customers frustrated? Where were existing sellers falling short?
              </p>
              <p className="text-neutral-600 leading-relaxed text-lg">
                Together with Co Founder Syed Irfan Shah, the vision was turned into reality.
                On 24th November 2025, The Trend Seller officially launched. Not as an experiment,
                but as a brand with a clear purpose, a curated product line, and a real plan.
                Today, it is a running, revenue generating business that serves customers across Pakistan.
              </p>
            </div>
          </section>

          {/* Founders Cards */}
          <section className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-amber-600">SA</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-1">Syed Saif Ali</h3>
                <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Founder</p>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Led the market research, brand strategy, and product development that gave
                  The Trend Seller its foundation before launch day.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-amber-600">IS</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-1">Syed Irfan Shah</h3>
                <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Co Founder</p>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Joined forces to bring The Trend Seller to life, contributing to operations,
                  growth, and building a brand that customers across Pakistan trust.
                </p>
              </div>
            </div>
          </section>

          {/* Why We Started */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Rocket className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900">Why We Started</h2>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-neutral-200 space-y-4">
              <p className="text-neutral-600 leading-relaxed text-lg">
                The drive behind The Trend Seller was never about following a trend or copying
                what others were doing. It was a genuine desire to create something valuable and
                lasting. A brand built with purpose, not just profit. The accessories market in
                Pakistan gave us the opportunity to do exactly that.
              </p>
              <p className="text-neutral-600 leading-relaxed text-lg">
                The research kept pointing to the same problems. Customers could not trust sellers,
                quality was inconsistent, and no one was treating the Pakistani buyer as someone
                who deserved a premium experience at a fair price.
              </p>
              <p className="text-neutral-600 leading-relaxed text-lg">
                The Trend Seller was our answer to that.
                <em className="text-neutral-800 font-medium"> A brand that takes quality seriously, treats every customer with respect, and proves that premium does not have to mean overpriced.</em>
              </p>
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900">The Journey</h2>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-amber-200 hidden md:block" />
              <div className="space-y-8">
                {milestones.map((item, index) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-md group-hover:bg-amber-600 transition-colors">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
                        {item.period}
                      </span>
                      <h3 className="text-xl font-bold text-neutral-900 mt-1 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* What's Next */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900">What is Next</h2>
            </div>
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-8 md:p-10 text-white">
              <p className="text-neutral-300 leading-relaxed text-lg mb-4">
                The foundation is solid. The brand is trusted. The business is generating revenue.
                And this is still only the beginning.
              </p>
              <p className="text-neutral-300 leading-relaxed text-lg mb-4">
                The same discipline that went into the research phase, the patience, the attention
                to detail, the refusal to cut corners, will continue to drive everything that
                comes next. More products, better experiences, deeper trust.
              </p>
              <p className="text-amber-400 font-semibold text-lg">
                Every order you have placed has been part of building this. Thank you for trusting
                The Trend Seller and for being part of something that was built the right way.
              </p>
              <div className="mt-4 text-right text-neutral-400 font-medium italic">
                Syed Saif Ali and Syed Irfan Shah
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">
              Be Part of the Story
            </h2>
            <p className="text-neutral-500 mb-6 max-w-lg mx-auto">
              Explore the collection built on a year of research and a commitment to quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/watches"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-neutral-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
              >
                Shop the Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-colors border border-neutral-300"
              >
                About The Brand
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
