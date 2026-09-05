import Scheme from "../models/Scheme.js";
import {
  calculateFinancialResult,
} from "../services/finance/index.js";

export async function calculateFinance(req, res, next) {
  try {
    const {
      projectCost,
      marginCapital,
      schemeId,
    } = req.body;

    if (
      projectCost === undefined ||
      marginCapital === undefined ||
      !schemeId
    ) {
      return res.status(400).json({
        message:
          "Project cost, margin capital and scheme ID are required",
      });
    }

    // Find the scheme selected by the user
    const scheme = await Scheme.findOne({
      _id: schemeId,
      active: true,
    });

    if (!scheme) {
      return res.status(404).json({
        message: "Selected scheme not found",
      });
    }

    const numericProjectCost = Number(projectCost);
    const numericMarginCapital = Number(marginCapital);

    if (
      !Number.isFinite(numericProjectCost) ||
      numericProjectCost < 0
    ) {
      return res.status(400).json({
        message: "Project cost must be a valid number",
      });
    }

    if (
      !Number.isFinite(numericMarginCapital) ||
      numericMarginCapital < 0
    ) {
      return res.status(400).json({
        message: "Margin capital must be a valid number",
      });
    }

    if (numericMarginCapital > numericProjectCost) {
      return res.status(400).json({
        message: "Margin capital cannot exceed project cost",
      });
    }

    const requiredLoan =
      numericProjectCost - numericMarginCapital;

    if (requiredLoan <= 0) {
      return res.status(400).json({
        message:
          "No loan is required because margin capital covers the project cost",
      });
    }

    if (requiredLoan > scheme.maximumLoanAmount) {
      return res.status(400).json({
        message:
          "Required loan exceeds the maximum loan amount of the selected scheme",
        maximumLoanAmount: scheme.maximumLoanAmount,
        requiredLoan,
      });
    }

    // Find the correct slab for the selected scheme
    const slab = scheme.loanSlabs.find(
      (item) =>
        requiredLoan >= item.minLoanAmount &&
        requiredLoan <= item.maxLoanAmount
    );

    if (!slab) {
      return res.status(400).json({
        message:
          "No applicable loan slab found for the required loan amount",
      });
    }

    // Finance engine gets the scheme's actual rules
    const financialResult = calculateFinancialResult({
      projectCost: numericProjectCost,
      marginCapital: numericMarginCapital,
      interestRate: slab.interestRate,
      tenureYears: slab.tenureYears,
    });

    res.json({
      scheme: {
        id: scheme._id,
        name: scheme.name,
        code: scheme.code,
      },

      financialResult: {
        ...financialResult,
        requiredLoan,
        maximumLoanAmount: scheme.maximumLoanAmount,
        interestRate: slab.interestRate,
        tenureYears: slab.tenureYears,
        moratoriumMonths: slab.moratoriumMonths,
      },
    });
  } catch (err) {
    next(err);
  }
}