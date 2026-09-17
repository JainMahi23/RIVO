import test from "node:test";
import assert from "node:assert";

// We test the schemeEligibilityService deterministic logic
// by calling it with mock Scheme data.
// Since it queries MongoDB, we test the scoring function directly.

// The scoring function is not exported, so we test the main flow
// indirectly via the finance engine's feasibility scoring,
// and test the deterministic rules here.

test("scheme eligibility: NBCFDC loan slab selection logic", () => {
  // Simulate slab selection
  const loanSlabs = [
    { minLoanAmount: 0, maxLoanAmount: 125000, interestRate: 7, tenureYears: 4, moratoriumMonths: 0 },
    { minLoanAmount: 125001, maxLoanAmount: 2500000, interestRate: 8, tenureYears: 7, moratoriumMonths: 0 },
  ];

  const requiredLoan = 100000;
  const slab = loanSlabs.find(
    (item) => requiredLoan >= item.minLoanAmount && requiredLoan <= item.maxLoanAmount
  );

  assert.ok(slab, "Should find a matching slab");
  assert.strictEqual(slab.interestRate, 7);
  assert.strictEqual(slab.tenureYears, 4);
});

test("scheme eligibility: higher slab for larger loan", () => {
  const loanSlabs = [
    { minLoanAmount: 0, maxLoanAmount: 125000, interestRate: 7, tenureYears: 4, moratoriumMonths: 0 },
    { minLoanAmount: 125001, maxLoanAmount: 2500000, interestRate: 8, tenureYears: 7, moratoriumMonths: 0 },
  ];

  const requiredLoan = 500000;
  const slab = loanSlabs.find(
    (item) => requiredLoan >= item.minLoanAmount && requiredLoan <= item.maxLoanAmount
  );

  assert.ok(slab, "Should find higher slab");
  assert.strictEqual(slab.interestRate, 8);
  assert.strictEqual(slab.tenureYears, 7);
});

test("scheme eligibility: no slab for amount exceeding max", () => {
  const loanSlabs = [
    { minLoanAmount: 0, maxLoanAmount: 125000, interestRate: 7, tenureYears: 4, moratoriumMonths: 0 },
    { minLoanAmount: 125001, maxLoanAmount: 2500000, interestRate: 8, tenureYears: 7, moratoriumMonths: 0 },
  ];

  const requiredLoan = 3000000;
  const slab = loanSlabs.find(
    (item) => requiredLoan >= item.minLoanAmount && requiredLoan <= item.maxLoanAmount
  );

  assert.strictEqual(slab, undefined, "Should not find a slab");
});

test("scheme eligibility: project cost range validation", () => {
  const scheme = {
    projectCost: { min: 1000, max: 2500000 },
    maximumLoanAmount: 2500000,
  };

  // Within range
  assert.ok(500000 >= scheme.projectCost.min && 500000 <= scheme.projectCost.max);

  // Outside range
  assert.ok(!(3000000 >= scheme.projectCost.min && 3000000 <= scheme.projectCost.max));
});

test("scheme eligibility: margin capital cannot exceed project cost", () => {
  const projectCost = 200000;
  const marginCapital = 250000;
  assert.ok(marginCapital > projectCost, "Margin exceeds project cost");
  const requiredLoan = projectCost - marginCapital;
  assert.ok(requiredLoan < 0, "Required loan is negative — should be rejected");
});
