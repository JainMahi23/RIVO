import test from "node:test";
import assert from "node:assert";

import {
  calculateLoanAmount,
  calculateEMI,
  calculateTotalInterest,
  generateRepaymentSchedule,
  calculateFinancialResult,
  estimateMonthlyRevenue,
  estimateMonthlyExpenses,
  calculateProfitMetrics,
  assessFeasibility,
} from "../services/finance/index.js";

// ===================== Loan Amount =====================

test("calculateLoanAmount: basic subtraction", () => {
  assert.strictEqual(calculateLoanAmount(500000, 100000), 400000);
});

test("calculateLoanAmount: zero margin", () => {
  assert.strictEqual(calculateLoanAmount(500000, 0), 500000);
});

test("calculateLoanAmount: margin equals cost", () => {
  assert.strictEqual(calculateLoanAmount(100000, 100000), 0);
});

test("calculateLoanAmount: throws if margin > cost", () => {
  assert.throws(
    () => calculateLoanAmount(100000, 200000),
    { message: "Margin capital cannot exceed project cost" }
  );
});

test("calculateLoanAmount: throws on negative cost", () => {
  assert.throws(
    () => calculateLoanAmount(-1, 0),
    { message: "Project cost must be a valid non-negative number" }
  );
});

// ===================== EMI =====================

test("calculateEMI: standard calculation", () => {
  // 100000 at 12% for 1 year = ~8884.88
  const emi = calculateEMI(100000, 12, 1);
  assert.ok(Math.abs(emi - 8884.88) < 1, `EMI was ${emi}`);
});

test("calculateEMI: zero interest", () => {
  const emi = calculateEMI(120000, 0, 1);
  assert.strictEqual(emi, 10000); // 120000 / 12
});

test("calculateEMI: throws on zero tenure", () => {
  assert.throws(
    () => calculateEMI(100000, 10, 0),
    { message: "Tenure must be greater than 0" }
  );
});

// ===================== Total Interest =====================

test("calculateTotalInterest: basic", () => {
  const emi = calculateEMI(100000, 12, 1);
  const interest = calculateTotalInterest(100000, emi, 1);
  // Total payment = emi * 12 - principal
  assert.ok(interest > 0, "Interest should be positive");
  assert.ok(interest < 100000, "Interest should be less than principal for 1 year");
});

test("calculateTotalInterest: zero interest produces zero", () => {
  const emi = calculateEMI(120000, 0, 1);
  const interest = calculateTotalInterest(120000, emi, 1);
  assert.strictEqual(interest, 0);
});

// ===================== Repayment Schedule =====================

test("generateRepaymentSchedule: correct length", () => {
  const schedule = generateRepaymentSchedule(100000, 10, 2);
  assert.strictEqual(schedule.length, 24); // 2 years * 12
});

test("generateRepaymentSchedule: final balance is zero", () => {
  const schedule = generateRepaymentSchedule(100000, 10, 2);
  const last = schedule[schedule.length - 1];
  assert.strictEqual(last.remainingBalance, 0);
});

test("generateRepaymentSchedule: period numbers sequential", () => {
  const schedule = generateRepaymentSchedule(50000, 8, 1);
  schedule.forEach((entry, i) => {
    assert.strictEqual(entry.period, i + 1);
  });
});

// ===================== Revenue & Expenses =====================

test("estimateMonthlyRevenue: default multiplier", () => {
  const revenue = estimateMonthlyRevenue(500000);
  assert.strictEqual(revenue, 75000); // 500000 * 0.15
});

test("estimateMonthlyRevenue: custom multiplier", () => {
  const revenue = estimateMonthlyRevenue(500000, 0.20);
  assert.strictEqual(revenue, 100000);
});

test("estimateMonthlyExpenses: default ratio", () => {
  const expenses = estimateMonthlyExpenses(75000);
  assert.strictEqual(expenses, 48750); // 75000 * 0.65
});

// ===================== Profit Metrics =====================

test("calculateProfitMetrics: basic", () => {
  const metrics = calculateProfitMetrics(75000, 48750, 5000);
  assert.strictEqual(metrics.grossProfit, 26250);
  assert.strictEqual(metrics.netProfit, 21250);
  assert.ok(metrics.grossMargin > 0);
  assert.ok(metrics.netMargin > 0);
});

// ===================== Feasibility =====================

test("assessFeasibility: positive scenario", () => {
  const result = assessFeasibility({
    netProfit: 20000,
    monthlyEMI: 5000,
    loanAmount: 200000,
    projectCost: 500000,
    grossMargin: 40,
  });
  assert.ok(result.score >= 60);
  assert.ok(["HIGHLY_FEASIBLE", "FEASIBLE"].includes(result.verdict));
});

test("assessFeasibility: negative scenario", () => {
  const result = assessFeasibility({
    netProfit: -5000,
    monthlyEMI: 30000,
    loanAmount: 950000,
    projectCost: 1000000,
    grossMargin: 10,
  });
  assert.ok(result.score < 60);
  assert.ok(result.verdict !== "HIGHLY_FEASIBLE");
});

// ===================== Full Financial Result =====================

test("calculateFinancialResult: returns all sections", () => {
  const result = calculateFinancialResult({
    projectCost: 500000,
    marginCapital: 100000,
    interestRate: 8,
    tenureYears: 5,
  });

  assert.strictEqual(result.projectCost, 500000);
  assert.strictEqual(result.marginCapital, 100000);
  assert.strictEqual(result.loanAmount, 400000);
  assert.ok(result.emi > 0);
  assert.ok(result.totalInterest > 0);
  assert.ok(result.totalRepayment > 0);
  assert.ok(result.repaymentSchedule.length === 60);
  assert.ok(result.profitMetrics);
  assert.ok(result.feasibility);
  assert.ok(result.feasibility.score >= 0);
  assert.ok(result.feasibility.verdict);
});
