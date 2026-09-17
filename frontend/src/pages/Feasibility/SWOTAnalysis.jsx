const DEFAULT_SWOT = {
  strengths: ['Strong existing footfall in simple, plain language', 'Low nearby competition'],
  weaknesses: ['Seasonal cash flow in the first two quarters', 'Limited working capital buffer'],
  opportunities: ['Government subsidy available under PMEGP', 'Growing demand from nearby households'],
  threats: ['Input price fluctuation', 'A new competitor entering the catchment area'],
};

const SECTIONS = [
  { key: 'strengths', title: 'Strengths', tone: 'text-forest', bg: 'bg-forest/5' },
  { key: 'weaknesses', title: 'Weaknesses', tone: 'text-terracotta-dark', bg: 'bg-terracotta/5' },
  { key: 'opportunities', title: 'Opportunities', tone: 'text-gold-dark', bg: 'bg-gold/10' },
  { key: 'threats', title: 'Threats', tone: 'text-ink/70', bg: 'bg-ink/5' },
];

export default function SWOTAnalysis({ data = DEFAULT_SWOT }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {SECTIONS.map(({ key, title, tone, bg }) => (
        <div key={key} className={`rounded-card p-4 ${bg}`}>
          <p className={`text-sm font-semibold mb-2 ${tone}`}>{title}</p>
          <ul className="space-y-1.5 text-sm text-ink/65 list-disc list-inside">
            {(data[key] || DEFAULT_SWOT[key]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
