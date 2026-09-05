import Scheme from "../../models/Scheme.js";

function calculateRecommendationScore({
  scheme,
  requiredLoan,
  interestRate,
  tenureYears,
}) {
  let score = 0;

  // 1. Prefer schemes that can cover the required loan comfortably
  const loanCoverage =
    requiredLoan / scheme.maximumLoanAmount;

  if (loanCoverage <= 0.6) {
    score += 35;
  } else if (loanCoverage <= 0.8) {
    score += 30;
  } else if (loanCoverage <= 1) {
    score += 25;
  }

  // 2. Lower interest rate gets a better score
  if (interestRate <= 7) {
    score += 30;
  } else if (interestRate <= 8) {
    score += 25;
  } else if (interestRate <= 10) {
    score += 20;
  } else {
    score += 10;
  }

  // 3. Reasonable repayment tenure
  if (tenureYears >= 5) {
    score += 20;
  } else if (tenureYears >= 3) {
    score += 15;
  } else {
    score += 10;
  }

  // 4. Prefer lower beneficiary contribution
  const beneficiaryShare =
    scheme.financing?.beneficiarySharePercentage;

  if (beneficiaryShare !== undefined) {
    if (beneficiaryShare <= 10) {
      score += 15;
    } else if (beneficiaryShare <= 20) {
      score += 10;
    } else {
      score += 5;
    }
  }

  return Math.min(score, 100);
}

export async function findEligibleSchemes({
  projectCost,
  marginCapital,
}) {
  if (
    projectCost === undefined ||
    projectCost === null ||
    !Number.isFinite(projectCost) ||
    projectCost < 0
  ) {
    throw new Error(
      "Valid project cost is required"
    );
  }

  if (
    marginCapital === undefined ||
    marginCapital === null ||
    !Number.isFinite(marginCapital) ||
    marginCapital < 0
  ) {
    throw new Error(
      "Valid margin capital is required"
    );
  }

  if (marginCapital > projectCost) {
    throw new Error(
      "Margin capital cannot exceed project cost"
    );
  }

  const requiredLoan =
    projectCost - marginCapital;

  if (requiredLoan === 0) {
    return {
      requiredLoan: 0,
      recommendations: [],
    };
  }

  const schemes = await Scheme.find({
    active: true,

    "projectCost.min": {
      $lte: projectCost,
    },

    "projectCost.max": {
      $gte: projectCost,
    },
  });

  const recommendations = [];

  for (const scheme of schemes) {
    // Required loan cannot exceed scheme maximum
    if (
      requiredLoan >
      scheme.maximumLoanAmount
    ) {
      continue;
    }

    // Find applicable loan slab
    const slab =
      scheme.loanSlabs.find(
        (item) =>
          requiredLoan >=
            item.minLoanAmount &&
          requiredLoan <=
            item.maxLoanAmount
      );

    if (!slab) {
      continue;
    }

    const score =
      calculateRecommendationScore({
        scheme,
        requiredLoan,
        interestRate:
          slab.interestRate,
        tenureYears:
          slab.tenureYears,
      });

    recommendations.push({
      schemeId: scheme._id,

      name: scheme.name,

      code: scheme.code,

      score,

      projectCost,

      marginCapital,

      requiredLoan,

      maximumLoanAmount:
        scheme.maximumLoanAmount,

      interestRate:
        slab.interestRate,

      tenureYears:
        slab.tenureYears,

      moratoriumMonths:
        slab.moratoriumMonths,

      financing:
        scheme.financing,
    });
  }

  // Highest recommendation score first
  recommendations.sort(
    (a, b) => b.score - a.score
  );

  return {
    requiredLoan,
    recommendations,
  };
}