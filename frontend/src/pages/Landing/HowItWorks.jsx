import { Lightbulb, ClipboardCheck, Rocket } from 'lucide-react';

const STEPS = [
  {
    icon: Lightbulb,
    title: 'Share your idea',
    text: 'Tell us about yourself and the village business you want to start — from a kirana store to a cold-press unit.',
  },
  {
    icon: ClipboardCheck,
    title: 'See your local reality',
    text: 'Drop a pin on your village and get demand scores, nearby competition, and a financial plan built for your area.',
  },
  {
    icon: Rocket,
    title: 'Launch and finance it',
    text: 'Get a feasibility report, a matching government scheme, and the documents you need to apply for funding.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-display text-forest text-center">How it works</h2>
      <p className="text-ink/55 text-center mt-2 max-w-lg mx-auto">
        Three steps between where you are today and a business plan a bank will take seriously.
      </p>
      <div className="grid sm:grid-cols-3 gap-5 mt-12">
        {STEPS.map((s, i) => (
          <div key={s.title} className="card relative">
            <span className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-forest text-cream text-sm font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gold/15 text-gold-dark mb-4">
              <s.icon size={20} strokeWidth={2.25} />
            </span>
            <h3 className="font-sans font-semibold text-forest text-base">{s.title}</h3>
            <p className="text-sm text-ink/55 mt-1.5 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
