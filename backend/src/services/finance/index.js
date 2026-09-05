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

export function calculateFinancialResult({
  projectCost,
  marginCapital,
  interestRate,
  tenureYears,
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

  return {
    projectCost,
    marginCapital,
    loanAmount: Number(loanAmount.toFixed(2)),
    interestRate,
    tenureYears,
    emi: Number(emi.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    repaymentSchedule,
  };
}