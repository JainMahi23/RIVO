import {
  createAssessment as createAssessmentService,
  getUserAssessments,
  getUserAssessmentById,
  updateUserAssessment,
} from "../services/assessment/assessmentService.js";

export async function createAssessment(req, res, next) {
  try {
    const {
      businessCategory,
      location,
      personalInfo,
      businessInfo,
      financialInput,
    } = req.body;

    if (!businessCategory || !location) {
      return res.status(400).json({
        message: "Business category and location are required",
      });
    }

    if (
      !financialInput ||
      financialInput.marginCapital === undefined
    ) {
      return res.status(400).json({
        message: "Margin capital is required",
      });
    }

    const assessment = await createAssessmentService(
      req.user._id,
      {
        businessCategory,
        location,
        personalInfo,
        businessInfo,
        financialInput,
      }
    );

    res.status(201).json({
      message: "Assessment created successfully",
      assessment,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAssessments(req, res, next) {
  try {
    const assessments = await getUserAssessments(req.user._id);

    res.json({
      assessments,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAssessmentById(req, res, next) {
  try {
    const assessment = await getUserAssessmentById(
      req.user._id,
      req.params.id
    );

    if (!assessment) {
      return res.status(404).json({
        message: "Assessment not found",
      });
    }

    res.json({
      assessment,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAssessment(req, res, next) {
  try {
    const assessment = await updateUserAssessment(
      req.user._id,
      req.params.id,
      req.body
    );

    if (!assessment) {
      return res.status(404).json({
        message: "Assessment not found",
      });
    }

    res.json({
      message: "Assessment updated successfully",
      assessment,
    });
  } catch (err) {
    next(err);
  }
}