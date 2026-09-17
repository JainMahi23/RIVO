export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h2 className="text-3xl font-display text-forest">Why Rivo exists</h2>
      <p className="text-ink/60 mt-4 leading-relaxed max-w-2xl mx-auto">
        Most feasibility advice for small rural businesses is generic, and most loan schemes go
        unclaimed simply because no one matched them to the right applicant. Rivo combines local
        market data, a transparent financial model, and a live map of government schemes so a
        first-time entrepreneur in any village can build a plan a bank will actually approve.
      </p>
      <div className="grid sm:grid-cols-3 gap-6 mt-10 text-left">
        <div>
          <p className="font-display text-2xl text-gold-dark">20+</p>
          <p className="text-sm text-ink/55 mt-1">Government schemes matched automatically</p>
        </div>
        <div>
          <p className="font-display text-2xl text-gold-dark">2</p>
          <p className="text-sm text-ink/55 mt-1">Languages: English and Hindi, more coming</p>
        </div>
        <div>
          <p className="font-display text-2xl text-gold-dark">0</p>
          <p className="text-sm text-ink/55 mt-1">Cost to run a feasibility assessment</p>
        </div>
      </div>
    </section>
  );
}
