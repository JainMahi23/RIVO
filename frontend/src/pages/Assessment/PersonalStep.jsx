import { useState } from 'react';
import FormField, { TextInput, SelectInput } from '../../components/common/FormField.jsx';
import Button from '../../components/common/Button.jsx';

const SKILL_OPTIONS = ['Retail / trading', 'Farming / agri-processing', 'Tailoring / crafts', 'Repair / technical', 'Other'];

export default function PersonalStep({ initial = {}, onNext }) {
  const [form, setForm] = useState({
    firstName: initial.firstName || '',
    lastName: initial.lastName || '',
    incomeSkill: initial.incomeSkill || '',
    fundingNeeded: initial.fundingNeeded || '',
    skills: initial.skills || '',
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
      <h2 className="font-semibold text-forest">Tell us about yourself</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="First name">
          <TextInput required value={form.firstName} onChange={update('firstName')} placeholder="Ramesh" />
        </FormField>
        <FormField label="Last name">
          <TextInput required value={form.lastName} onChange={update('lastName')} placeholder="Kumar" />
        </FormField>
      </div>
      <FormField label="Current income skill">
        <SelectInput required value={form.incomeSkill} onChange={update('incomeSkill')}>
          <option value="" disabled>Select an option</option>
          {SKILL_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </SelectInput>
      </FormField>
      <FormField label="Funding needed (approx.)">
        <TextInput
          required
          type="number"
          min={0}
          value={form.fundingNeeded}
          onChange={update('fundingNeeded')}
          placeholder="e.g. 150000"
        />
      </FormField>
      <FormField label="Skills" hint="Anything relevant — machinery, bookkeeping, a trade you know">
        <TextInput value={form.skills} onChange={update('skills')} placeholder="e.g. tailoring, basic accounting" />
      </FormField>
      <div className="flex justify-end pt-2">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}
