import { useState } from 'react';
import FormField, { TextInput, SelectInput } from '../../components/common/FormField.jsx';
import Button from '../../components/common/Button.jsx';

const BUSINESS_TYPES = ['Kirana / general store', 'Agro-processing unit', 'Solar / repair services', 'Tailoring unit', 'Other'];
const SCALE_OPTIONS = ['Micro (solo, home-based)', 'Small (1-3 employees)', 'Growing (4+ employees)'];

export default function BusinessStep({ initial = {}, onNext, onBack }) {
  const [form, setForm] = useState({
    businessType: initial.businessType || '',
    scale: initial.scale || '',
    projectCost: initial.projectCost || '',
    ownContribution: initial.ownContribution || '',
    existingLiabilities: initial.existingLiabilities || '',
    description: initial.description || '',
  });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext(form);
      }}
      className="space-y-5"
    >
      <h2 className="font-semibold text-forest">Describe your business idea</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Type of business">
          <SelectInput required value={form.businessType} onChange={update('businessType')}>
            <option value="" disabled>Select a type</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </SelectInput>
        </FormField>
        <FormField label="Scale">
          <SelectInput required value={form.scale} onChange={update('scale')}>
            <option value="" disabled>Select a scale</option>
            {SCALE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </SelectInput>
        </FormField>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Estimated project cost (₹)">
          <TextInput
            required
            type="number"
            min={0}
            value={form.projectCost}
            onChange={update('projectCost')}
            placeholder="e.g. 300000"
          />
        </FormField>
        <FormField label="Your own contribution (₹)">
          <TextInput
            required
            type="number"
            min={0}
            value={form.ownContribution}
            onChange={update('ownContribution')}
            placeholder="e.g. 60000"
          />
        </FormField>
      </div>
      <FormField label="Existing liabilities (₹)" hint="Any current loans or dues. Enter 0 if none.">
        <TextInput
          type="number"
          min={0}
          value={form.existingLiabilities}
          onChange={update('existingLiabilities')}
          placeholder="0"
        />
      </FormField>
      <FormField label="Describe your idea">
        <textarea
          className="input min-h-24"
          required
          value={form.description}
          onChange={update('description')}
          placeholder="What will you sell or make, and to whom?"
        />
      </FormField>
      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}
