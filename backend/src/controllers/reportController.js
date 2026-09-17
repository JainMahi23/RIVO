import {
  generateReportForAssessment,
  getReportByAssessmentId,
} from "../services/report/reportService.js";

/**
 * POST /api/reports/generate/:assessmentId
 */
export async function generateReport(req, res, next) {
  try {
    const report = await generateReportForAssessment(
      req.params.assessmentId,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Report generated successfully",
      data: report,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reports/assessment/:assessmentId
 */
export async function getReportByAssessment(req, res, next) {
  try {
    const report = await getReportByAssessmentId(
      req.params.assessmentId,
      req.user._id
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found. Generate one first.",
      });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    next(err);
  }
}
