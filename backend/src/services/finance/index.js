// =============================================================
// RIVO Deterministic Financial Engine
// =============================================================
// All calculations here are pure, deterministic math.
// No AI, no randomness, no external API calls.
// =============================================================

export function calculateLoanAmount(projectCost, marginCapital) {
  if (!Number.isFinite(projectCost) || projectCost < 0) {
    throw new Error("Project cost must be a valid non-negative number");
  }

  if (!Number.isFinite(marginCapital) || marginCapital < 0) {
    throw new Error("Margin capital must be a valid non-negative number");
  }

  if (marginCapital > projectCost) {
    throw new Error("Margin capital cannot exceed project cost");
  }

  return projectCost - marginCapital;
}

export function calculateEMI(
  principal,
  annualInterestRate,
  tenureYears
) {
  if (!Number.isFinite(principal) || principal < 0) {
    throw new Error("Principal must be a valid non-negative number");
  }

  if (
    !Number.isFinite(annualInterestRate) ||
    annualInterestRate < 0
  ) {
    throw new Error(
      "Interest rate must be a valid non-negative number"
    );
  }

  if (!Number.isFinite(tenureYears) || tenureYears <= 0) {
    throw new Error("Tenure must be greater than 0");
  }

  // Zero-interest case
  if (annualInterestRate === 0) {
    return principal / (tenureYears * 12);
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi =
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return emi;
}

export function calculateTotalInterest(
  principal,
  emi,
  tenureYears
) {
  const totalMonths = tenureYears * 12;

  const totalPayment = emi * totalMonths;

  return Math.max(0, totalPayment - principal);
}

export function generateRepaymentSchedule(
  principal,
  annualInterestRate,
  tenureYears
) {
  const totalMonths = tenureYears * 12;

  const emi = calculateEMI(
    principal,
    annualInterestRate,
    tenureYears
  );

  const monthlyRate = annualInterestRate / 12 / 100;

  let remainingBalance = principal;

  const repaymentSchedule = [];

  for (let month = 1; month <= totalMonths; month++) {
    const interest =
      annualInterestRate === 0
        ? 0
        : remainingBalance * monthlyRate;

    let principalPayment = emi - interest;

    if (month === totalMonths) {
      principalPayment = remainingBalance;
    }

    const installment = principalPayment + interest;

    remainingBalance =
      remainingBalance - principalPayment;

    if (remainingBalance < 0.01) {
      remainingBalance = 0;
    }

    repaymentSchedule.push({
      period: month,
      principal: Number(principalPayment.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      installment: Number(installment.toFixed(2)),
      remainingBalance: Number(remainingBalance.toFixed(2)),
    });
  }

  return repaymentSchedule;
}

// =============================================================
// Revenue, Expense, Profit & Feasibility
// =============================================================

/**
 * Estimate monthly revenue based on project cost and a revenue multiplier.
 * The multiplier is a conservative ratio based on sector norms.
 *
 * @param {number} projectCost
 * @param {number} [revenueMultiplier=0.15] - expected monthly revenue as fraction of project cost
 */
export function estimateMonthlyRevenue(projectCost, revenueMultiplier = 0.15) {
  return Number((projectCost * revenueMultiplier).toFixed(2));
}

/**
 * Estimate monthly operating expenses (raw materials, wages, utilities, rent, misc).
 * Uses a cost ratio as fraction of monthly revenue.
 *
 * @param {number} monthlyRevenue
 * @param {number} [costRatio=0.65] - operating expenses as fraction of revenue
 */
export function estimateMonthlyExpenses(monthlyRevenue, costRatio = 0.65) {
  return Number((monthlyRevenue * costRatio).toFixed(2));
}

/**
 * Calculate profit metrics.
 */
export function calculateProfitMetrics(monthlyRevenue, monthlyExpenses, monthlyEMI) {
  const grossProfit = monthlyRevenue - monthlyExpenses;
  const netProfit = grossProfit - monthlyEMI;
  const grossMargin = monthlyRevenue > 0
    ? Number(((grossProfit / monthlyRevenue) * 100).toFixed(2))
    : 0;
  const netMargin = monthlyRevenue > 0
    ? Number(((netProfit / monthlyRevenue) * 100).toFixed(2))
    : 0;

  return {
    monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
    monthlyExpenses: Number(monthlyExpenses.toFixed(2)),
    monthlyEMI: Number(monthlyEMI.toFixed(2)),
    grossProfit: Number(grossProfit.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    grossMargin,
    netMargin,
    annualRevenue: Number((monthlyRevenue * 12).toFixed(2)),
    annualExpenses: Number((monthlyExpenses * 12).toFixed(2)),
    annualNetProfit: Number((netProfit * 12).toFixed(2)),
  };
}

/**
 * Determine basic feasibility based on financial metrics.
 * Returns a deterministic verdict string and a 0-100 score.
 */
export function assessFeasibility({
  netProfit,
  monthlyEMI,
  loanAmount,
  projectCost,
  grossMargin,
}) {
  let score = 0;
  const factors = [];

  // 1. Net profit positive? (30 points)
  if (netProfit > 0) {
    score += 30;
    factors.push("Net profit is positive after EMI deduction");
  } else {
    factors.push("WARNING: Net profit is negative after EMI");
  }

  // 2. DSCR — Debt Service Coverage Ratio (25 points)
  const dscr = monthlyEMI > 0
    ? Number(((netProfit + monthlyEMI) / monthlyEMI).toFixed(2))
    : 999;
  if (dscr >= 1.5) {
    score += 25;
    factors.push(`Strong DSCR of ${dscr}`);
  } else if (dscr >= 1.2) {
    score += 15;
    factors.push(`Adequate DSCR of ${dscr}`);
  } else if (dscr >= 1.0) {
    score += 5;
    factors.push(`Marginal DSCR of ${dscr}`);
  } else {
    factors.push(`Weak DSCR of ${dscr} — income may not cover EMI`);
  }

  // 3. Gross margin (20 points)
  if (grossMargin >= 35) {
    score += 20;
    factors.push(`Healthy gross margin of ${grossMargin}%`);
  } else if (grossMargin >= 25) {
    score += 12;
    factors.push(`Moderate gross margin of ${grossMargin}%`);
  } else {
    score += 5;
    factors.push(`Low gross margin of ${grossMargin}%`);
  }

  // 4. Loan-to-project ratio (15 points) — lower is better
  const loanRatio = projectCost > 0
    ? Number(((loanAmount / projectCost) * 100).toFixed(2))
    : 0;
  if (loanRatio <= 60) {
    score += 15;
    factors.push(`Conservative leverage: ${loanRatio}% loan-to-project`);
  } else if (loanRatio <= 80) {
    score += 10;
    factors.push(`Moderate leverage: ${loanRatio}% loan-to-project`);
  } else {
    score += 5;
    factors.push(`High leverage: ${loanRatio}% loan-to-project`);
  }

  // 5. Break-even period estimate (10 points)
  const breakEvenMonths = netProfit > 0
    ? Math.ceil(projectCost / netProfit)
    : Infinity;
  if (breakEvenMonths <= 24) {
    score += 10;
    factors.push(`Quick break-even: ~${breakEvenMonths} months`);
  } else if (breakEvenMonths <= 48) {
    score += 5;
    factors.push(`Moderate break-even: ~${breakEvenMonths} months`);
  } else {
    factors.push("Break-even exceeds 48 months");
  }

  // Determine verdict
  let verdict;
  if (score >= 80) {
    verdict = "HIGHLY_FEASIBLE";
  } else if (score >= 60) {
    verdict = "FEASIBLE";
  } else if (score >= 40) {
    verdict = "MARGINALLY_FEASIBLE";
  } else {
    verdict = "NOT_FEASIBLE";
  }

  return {
    score,
    verdict,
    dscr,
    loanToProjectRatio: loanRatio,
    breakEvenMonths: breakEvenMonths === Infinity ? null : breakEvenMonths,
    factors,
  };
}

// =============================================================
// Main entry point for full financial calculation
// =============================================================

export function calculateFinancialResult({
  projectCost,
  marginCapital,
  interestRate,
  tenureYears,
  revenueMultiplier,
  costRatio,
}) {
  const loanAmount = calculateLoanAmount(
    projectCost,
    marginCapital
  );

  const emi = calculateEMI(
    loanAmount,
    interestRate,
    tenureYears
  );

  const totalInterest = calculateTotalInterest(
    loanAmount,
    emi,
    tenureYears
  );

  const repaymentSchedule =
    generateRepaymentSchedule(
      loanAmount,
      interestRate,
      tenureYears
    );

  // Revenue & profitability
  const monthlyRevenue = estimateMonthlyRevenue(projectCost, revenueMultiplier);
  const monthlyExpenses = estimateMonthlyExpenses(monthlyRevenue, costRatio);
  const profitMetrics = calculateProfitMetrics(monthlyRevenue, monthlyExpenses, emi);

  // Feasibility assessment
  const feasibility = assessFeasibility({
    netProfit: profitMetrics.netProfit,
    monthlyEMI: emi,
    loanAmount,
    projectCost,
    grossMargin: profitMetrics.grossMargin,
  });

  return {
    projectCost,
    marginCapital,
    loanAmount: Number(loanAmount.toFixed(2)),
    interestRate,
    tenureYears,
    emi: Number(emi.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalRepayment: Number((loanAmount + totalInterest).toFixed(2)),
    repaymentSchedule,
    profitMetrics,
    feasibility,
  };
}