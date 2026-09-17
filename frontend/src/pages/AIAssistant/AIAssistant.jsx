import AIChatWidget from '../../components/ai/AIChatWidget.jsx';

const PROMPTS = [
  'Explain my feasibility score',
  'What schemes do I qualify for?',
  'How is my EMI calculated?',
  'योजनाएं सुझाएं',
];

export default function AIAssistant() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display text-forest">AI Assistant</h1>
        <p className="text-sm text-ink/55 mt-1">Ask anything about your assessment, in English or Hindi.</p>
      </div>
      <AIChatWidget suggestedPrompts={PROMPTS} className="h-[520px]" />
    </div>
  );
}
